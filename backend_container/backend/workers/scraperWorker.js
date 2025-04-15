const { parentPort, workerData } = require('worker_threads');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');

const scriptPath = path.join(__dirname, '../../', 'scrapers', 'SteamApiPagination.py');
const pythonPath = path.join(__dirname, '../../', 'scrapers', 'venv', 'bin', 'python');

logger.info("Worker initialized. Waiting for tasks...");

async function waitForFile(filePath, maxRetries = 30, interval = 1000) {
  return new Promise((resolve, reject) => {
    let attempts = 0;

    const checkFile = async () => {
      try {
        logger.info(`Checking file: ${filePath}`);
        await fs.promises.access(filePath, fs.constants.F_OK);
        const data = await fs.promises.readFile(filePath, 'utf-8');
        logger.info(`File found and read: ${filePath}`);
        resolve(JSON.parse(data));
      } catch (err) {
        if (attempts < maxRetries) {
          attempts++;
          logger.warn(`File not found, retrying... (${attempts}/${maxRetries})`);
          setTimeout(checkFile, interval);
        } else {
          reject(new Error(`Timeout: JSON file not found after ${maxRetries} retries`));
        }
      }
    };

    checkFile();
  });
}

async function runPythonScript(appid, workerId) {
  return new Promise((resolve, reject) => {
    logger.info(`Starting Python script for appid: ${appid}, worker: ${workerId}`);

    const pythonProcess = spawn(pythonPath, [scriptPath, appid, workerId]);

    let stderrData = '';

    pythonProcess.stderr.on('data', (data) => {
      stderrData += data.toString();
      logger.error(`Python stderr for appid ${appid}: ${data.toString()}`);
    });

    pythonProcess.on('close', async (code) => {
      logger.info(`Python script exited with code ${code} for appid ${appid}`);

      if (code !== 0) {
        return reject(new Error(`Python script error: ${stderrData}`));
      }

      const filePath = path.join(__dirname, `steam_reviews_${workerId}.json`);
      
      try {
        const result = await waitForFile(filePath);

        await fs.promises.unlink(filePath);
        logger.info(`File ${filePath} removed after processing.`);

        resolve(result);
      } catch (err) {
        reject(err);
      }
    });
    
    pythonProcess.on('error', (err) => {
      logger.error("Error with the Python process:", err);
      reject(new Error("Error spawning Python process"));
    });
  });
}

parentPort.on('message', async (data) => {
  if (!data || !data.appid || !data.workerId) {
    logger.error("Worker received invalid data:", data);
    parentPort.postMessage({ error: "AppID and workerId are required" });
    return;
  }

  logger.info(`Worker processing request for appid: ${data.appid}`);

  try {
    const result = await runPythonScript(data.appid, data.workerId);
    logger.info(`Worker sending result for appid ${data.appid}: ${JSON.stringify(result)}`);
    parentPort.postMessage(result);
  } catch (err) {
    logger.error(`Worker error while processing appid ${data.appid}: ${err.message}`);
    parentPort.postMessage({ error: err.message });
  }
});
