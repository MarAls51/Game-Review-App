const gameReviewSchema = require('../models/mongoSchema');

async function getGameMetrics(name) {
  return await gameReviewSchema.findOne({ name });
}

async function updateGameMetrics(name, metrics, canScrape) {
  return await gameReviewSchema.findOneAndUpdate(
    { name },
    { $set: { metrics, metrics_can_scrape: canScrape } },
    { upsert: true, new: true }
  );
}

module.exports = { getGameMetrics, updateGameMetrics };
