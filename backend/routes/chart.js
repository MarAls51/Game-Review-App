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

    if (gameStatData && gameStatData.metrics_can_scrape === false) {
      console.log(`Scraping is disabled for ${name}, returning server error.`);
      return res.status(500).json({ message: `Cannot scrape metrics for ${name}. Scraping is disabled.` });
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
      try {
        if (code === 1) {
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

          await gameReviewSchema.findOneAndUpdate(
            { name }, 
            { $set: { metrics: gameData, metrics_can_scrape: true } },
            { upsert: true, new: true }
          );

          console.log(`Game metrics for ${name} saved successfully`);

          fs.unlinkSync(gamesDataPath);
          console.log(`${gamesDataPath} file deleted successfully.`);

          return res.status(200).json({ game: gameStatData.name, metrics: gameStatData.metrics });
        } else {
          console.log(`Unable to scrape ${name}'s stats`);

          if (gameStatData) {
            gameStatData.metrics_can_scrape = false;
            await gameReviewSchema.findOneAndUpdate(
              { name },
              { $set: { metrics_can_scrape: false } },
              { upsert: true, new: true }
            );
          }
          return res.status(400).json({ message: 'Invalid metric data', details: pythonError });
        }
      } catch (err) {
        console.error('Error processing Steam metrics:', err);

        if (gameStatData) {
          gameStatData.metrics_can_scrape = false;
          await gameReviewSchema.findOneAndUpdate(
            { name },
            { $set: { metrics_can_scrape: false } },
            { upsert: true, new: true }
          );
        }

        res.status(500).json({ message: 'Error processing game metrics', error: err.message });
      }
    });

    pythonProcess.on('error', async (err) => {
      console.error(`Error executing Python script:`, err);

      if (gameStatData) {
        gameStatData.metrics_can_scrape = false;
        await gameReviewSchema.findOneAndUpdate(
          { name },
          { $set: { metrics_can_scrape: false } },
          { upsert: true, new: true }
        );
      }

      res.status(500).json({ message: 'Failed to execute Python script', error: err.message });
    });
  } catch (error) {
    console.error(`Error validating ${name}`, error);

    if (!gameStatData) {
      gameStatData = new gameReviewSchema({ name, metrics_can_scrape: false });
    } else {
      gameStatData.metrics_can_scrape = false;
    }

    await gameReviewSchema.findOneAndUpdate(
      { name },
      { $set: { metrics_can_scrape: false } },
      { upsert: true, new: true }
    );

    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
