const express = require('express');
const router = express.Router();
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const gameReviewSchema = require('../database/mongoSchema');

require('dotenv').config();
const pythonPath = path.join(__dirname, '../../scrapers/env/Scripts/python');
const scriptPath = path.join(__dirname, '../../scrapers/SteamChartsScraper.py');

router.get('/steam-charts', async (req, res) => {
  const { appid, name } = req.query;
  const gamesDataPath = path.join(__dirname, `../games_${appid}.json`);
  console.log(gamesDataPath)

  if (!appid || !name) {
    console.log('Missing required parameters: appid, name');
    return res.status(400).json({ message: 'appid and name are required' });
  }

  try {
    console.log(`Extracting metrics for ${name}`);

    let gameStatData = await gameReviewSchema.findOne({ name });

    if (gameStatData && gameStatData.metrics) {
      console.log(`Game metrics for ${name} already exist, returning existing data.`);
      return res.status(200).json(gameStatData.metrics);
    }

    console.log('Scraping metrics from SteamCharts...');
    const pythonProcess = spawn(pythonPath, [scriptPath, appid]);

    let pythonOutput = '';
    let pythonError = '';

    pythonProcess.stdout.on('data', (data) => {
      pythonOutput += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      pythonError += data.toString();
    });

    pythonProcess.on('close', async (code) => {
      if (code === 1) {
        if (gameStatData && gameStatData.metrics) {
          console.log(`Game metrics for ${name} already exist, returning existing data.`);
          return res.status(200).json(gameStatData.metrics);
        }
        console.log(`Steam metrics for ${name} have been successfully scraped`);

        if (!fs.existsSync(gamesDataPath)) {
          console.log(`JSON file ${gamesDataPath} does not exist.`);
          return res.status(500).json({ message: 'File not found' });
        }

        const gameData = JSON.parse(fs.readFileSync(gamesDataPath));

        if (!gameStatData) {
          console.log(`No existing game metrics for ${name}. Returning error.`);
          return res.status(404).json({ message: "Game metrics not found in the database." });
        }

        gameStatData.metrics = gameData;

        await gameStatData.save();

        console.log(`Game metrics for ${name} saved successfully`);

        fs.unlinkSync(gamesDataPath);
        console.log(`${gamesDataPath} file deleted successfully.`);

        return res.status(200).json({ game: gameStatData.name, metrics: gameStatData.metrics });
      } else {
        console.log(`Unable to scrape ${name}'s stats`);
        return res.status(400).json({ message: 'Invalid metric data', details: pythonError });
      }
    });

    pythonProcess.on('error', (err) => {
      console.error(`Error executing Python script:`, err);
      res.status(500).json({ message: 'Failed to execute Python script', error: err.message });
    });
  } catch (error) {
    console.error(`Error validating ${name}`, error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
