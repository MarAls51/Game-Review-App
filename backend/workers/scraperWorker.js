const { parentPort } = require('worker_threads');
const { spawn } = require('child_process');
const path = require('path');

const scriptPath = path.join(__dirname, 'scrapers', 'SteamScraper.py');
const pythonPath = path.join(__dirname, 'env', 'Scripts', 'python'); 

console.log("Worker initialized. Waiting for tasks...");

function runPythonScript(appid) {
  return new Promise((resolve, reject) => {
    console.log(`Starting Python script for appid: ${appid}`);
    console.log(`Python path: ${pythonPath}`);
    console.log(`Script path: ${scriptPath}`);

    const pythonProcess = spawn(pythonPath, [scriptPath, appid]);
    
    let stdoutData = '';
    let stderrData = '';

    pythonProcess.stdout.on('data', (data) => {
      stdoutData += data.toString();
      console.log(`Python stdout for appid ${appid}:`, data.toString());
    });

    pythonProcess.stderr.on('data', (data) => {
      stderrData += data.toString();
      console.error(`Python stderr for appid ${appid}:`, data.toString());
    });

    pythonProcess.on('close', (code) => {
      console.log(`Python script exited with code ${code} for appid ${appid}`);
      
      if (code !== 0) {
        console.error(`Python script error for appid ${appid}: ${stderrData}`);
        return reject(new Error(stderrData));
      }

      try {
        console.log(`Parsing Python output for appid ${appid}: ${stdoutData}`);
        const result = JSON.parse(stdoutData);
        resolve(result);
      } catch (parseError) {
        console.error(`JSON parsing error for appid ${appid}: ${stdoutData}`);
        reject(new Error("Error parsing Python output"));
      }
    });
  });
}

parentPort.on('message', async (data) => {
  if (!data || !data.appid) {
    console.error("Worker received invalid data:", data);
    parentPort.postMessage({ error: "AppID is required" });
    return;
  }

  console.log(`Worker processing request for appid: ${data.appid}`);

  try {
    const result = await runPythonScript(data.appid);
    console.log(`Worker sending result for appid ${data.appid}:`, result);
    parentPort.postMessage(result);
  } catch (err) {
    console.error(`Worker error while processing appid ${data.appid}:`, err.message);
    parentPort.postMessage({ error: err.message });
  }
});
