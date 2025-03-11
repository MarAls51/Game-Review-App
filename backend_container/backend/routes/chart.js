const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const { getGameMetrics, updateGameMetrics } = require('../controllers/gameController');
const { scrapeSteamCharts } = require('../services/steamChartService');
const logger = require('../utils/logger'); 

router.get('/steam-charts', async (req, res) => {
  const { appid, name } = req.query;
  const gamesDataPath = path.join(__dirname, `../games_${appid}.json`);

  if (!appid || !name) {
    return res.status(400).json({ message: 'appid and name are required' });
  }

  try {
    let gameStatData = await getGameMetrics(name);

    if (gameStatData?.metrics) {
      logger.info(`Retrieved ${name} metrics from the database`);
      return res.status(200).json(gameStatData.metrics);
    }

    if (gameStatData?.metrics_can_scrape === false) {
      return res.status(500).json({ message: `Cannot scrape metrics for ${name}.` });
    }

    logger.info(`Scraping stat data for ${name}:`);

    const pythonOutput = await scrapeSteamCharts(appid);
    logger.info(`Scraping completed for ${name}: ${pythonOutput}`);

    if (!fs.existsSync(gamesDataPath)) {
      logger.error(`File not found: ${gamesDataPath}`);
      gameStatData.metrics_can_scrape = false;
      return res.status(500).json({ message: 'Server Error' });
    }

    const gameData = JSON.parse(fs.readFileSync(gamesDataPath));

    gameStatData = await updateGameMetrics(name, gameData, true);

    fs.unlinkSync(gamesDataPath);
    logger.info(`Deleted file: ${gamesDataPath}`);

    res.status(200).json(gameStatData.metrics);
  } catch (error) {
    try {
      let gameStatData = await getGameMetrics(name);
      if (gameStatData) {
        await updateGameMetrics(name, null, false);
      }
    } catch (fetchError) {
      logger.error(`Failed to retrieve game metrics for ${name} in error handler: ${fetchError.message}`);
    }
    
    logger.error(`Error fetching or updating game metrics for ${name}: ${error.message}`);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
