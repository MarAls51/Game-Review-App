const { Worker } = require('worker_threads');
const path = require('path');

const WORKER_COUNT = 5;
const workerPool = [];
let workerIndex = 0;

function createWorker() {
  console.log("Creating a new worker thread...");
  return new Worker(path.join(__dirname, 'scraperWorker.js'));
}

for (let i = 0; i < WORKER_COUNT; i++) {
  workerPool.push(createWorker());
}

function getWorker() {
  if (workerPool.length > 0) {
    console.log("Reusing worker from pool...");
    return workerPool.pop();
  }
  console.log("No available workers, creating a new one...");
  return createWorker();
}

function runWorkerTask(appid) {
  return new Promise((resolve, reject) => {
    console.log(`Assigning worker to fetch TLDR for appid: ${appid}`);
    const worker = getWorker();

    const workerId = `worker_${workerIndex++}`;

    worker.once('message', (data) => {
      if (data.error) {
        console.error(`Worker error for appid ${appid}:`, data.error);
        reject(new Error(data.error));
      } else {
        console.log(`Received result for appid ${appid}`);
        resolve(data);
      }
      workerPool.push(worker);
    });

    worker.once('error', (err) => {
      console.error(`Worker encountered an error for appid ${appid}:`, err);
      reject(err);
      workerPool.push(worker);
    });

    console.log(`Sending message to worker for appid: ${appid} with workerId: ${workerId}`);
    worker.postMessage({ appid, workerId });
  });
}

module.exports = { runWorkerTask };
