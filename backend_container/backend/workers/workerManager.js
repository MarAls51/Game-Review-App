const { Worker } = require('worker_threads');
const path = require('path');
const logger = require('../utils/logger');

const WORKER_COUNT = 5;
const workerPool = [];
let workerIndex = 0;

function createWorker() {
  logger.info("Creating a new worker thread...");
  return new Worker(path.join(__dirname, 'scraperWorker.js'));
}

for (let i = 0; i < WORKER_COUNT; i++) {
  workerPool.push(createWorker());
}

function getWorker() {
  if (workerPool.length > 0) {
    logger.info("Reusing worker from pool...");
    return workerPool.pop();
  }
  logger.info("No available workers, creating a new one...");
  return createWorker();
}

function runWorkerTask(appid) {
  return new Promise((resolve, reject) => {
    logger.info(`Assigning worker to fetch TLDR for appid: ${appid}`);
    const worker = getWorker();

    const workerId = `worker_${workerIndex++}`;

    worker.once('message', (data) => {
      if (data.error) {
        logger.error(`Worker error for appid ${appid}:`, data.error);
        reject(new Error(data.error));
      } else {
        logger.info(`Received result for appid ${appid}`);
        resolve(data);
      }
      workerPool.push(worker);
    });

    worker.once('error', (err) => {
      logger.error(`Worker encountered an error for appid ${appid}:`, err);
      reject(err);
      workerPool.push(worker);
    });

    logger.info(`Sending message to worker for appid: ${appid} with workerId: ${workerId}`);
    worker.postMessage({ appid, workerId });
  });
}

module.exports = { runWorkerTask };
