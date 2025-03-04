const { parentPort, workerData } = require('worker_threads');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const scriptPath = path.join(__dirname, '../../', 'scrapers', 'SteamScraper.py');
const pythonPath = path.join(__dirname, '../../', 'scrapers', 'env', 'Scripts', 'python');

console.log("Worker initialized. Waiting for tasks...");

async function waitForFile(filePath, maxRetries = 30, interval = 1000) {
  return new Promise((resolve, reject) => {
    let attempts = 0;

    const checkFile = async () => {
      try {
        console.log(`Checking file: ${filePath}`);  
        await fs.promises.access(filePath, fs.constants.F_OK);
        const data = await fs.promises.readFile(filePath, 'utf-8');
        console.log(`File found and read: ${filePath}`);  
        resolve(JSON.parse(data));
      } catch (err) {
        if (attempts < maxRetries) {
          attempts++;
          console.log(`File not found, retrying... (${attempts}/${maxRetries})`); 
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
    console.log(`Starting Python script for appid: ${appid}, worker: ${workerId}`);

    const pythonProcess = spawn(pythonPath, [scriptPath, appid, workerId]);

    let stderrData = '';

    pythonProcess.stderr.on('data', (data) => {
      stderrData += data.toString();
      console.error(`Python stderr for appid ${appid}:`, data.toString());
    });

    pythonProcess.on('close', async (code) => {
      console.log(`Python script exited with code ${code} for appid ${appid}`);
    
      if (code !== 0) {
        return reject(new Error(`Python script error: ${stderrData}`));
      }
    
      const filePath = path.join(__dirname, `steam_reviews_${workerId}.json`);
      
      try {
        const result = await waitForFile(filePath); 

        await fs.promises.unlink(filePath);
        console.log(`File ${filePath} removed after processing.`);

        resolve(result);
      } catch (err) {
        reject(err);
      }
    });
    
    pythonProcess.on('error', (err) => {
      console.error("Error with the Python process:", err);
      reject(new Error("Error spawning Python process"));
    });
  });
}

parentPort.on('message', async (data) => {
  if (!data || !data.appid || !data.workerId) {
    console.error("Worker received invalid data:", data);
    parentPort.postMessage({ error: "AppID and workerId are required" });
    return;
  }

  console.log(`Worker processing request for appid: ${data.appid}`);

  try {
    const result = await runPythonScript(data.appid, data.workerId);
    console.log(`Worker sending result for appid ${data.appid}: ${data}`);
    parentPort.postMessage(result);
  } catch (err) {
    console.error(`Worker error while processing appid ${data.appid}:`, err.message);
    parentPort.postMessage({ error: err.message });
  }
});
