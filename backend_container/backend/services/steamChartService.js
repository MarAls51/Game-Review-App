const { spawn } = require('child_process');
const path = require('path');
const logger = require('../utils/logger'); 

require('dotenv').config();

const pythonPath = path.join(__dirname, '../../scrapers/venv/bin/python');
const scriptPath = path.join(__dirname, '../../scrapers/SteamChartsScraper.py');

async function scrapeSteamCharts(appid) {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn(pythonPath, [scriptPath, appid]);

    let pythonOutput = '';
    let pythonError = '';

    pythonProcess.stdout.on('data', (data) => {
      pythonOutput += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      pythonError += data.toString();
    });

    pythonProcess.on('close', (code) => {
      if (code === 1) {
        logger.info(`Python script executed successfully for appid: ${appid}`); 
        resolve(pythonOutput);
      } else {
        logger.error(`Error in python script for appid: ${appid} - ${pythonError}`);
        reject(new Error(pythonError));
      }
    });

    pythonProcess.on('error', (err) => {
      logger.error(`Python process failed for appid: ${appid} - ${err.message}`); 
      reject(err);
    });
  });
}

module.exports = { scrapeSteamCharts };
