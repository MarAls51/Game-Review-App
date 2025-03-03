const express = require('express');
const router = express.Router();
const { runWorkerTask } = require('../workers/workerManager');

router.get("/tldr", async (req, res) => {
  const { appid } = req.query;

  if (!appid || typeof appid !== "string") {
    return res.status(400).json({ error: "Valid AppID is required" });
  }

  try {
    const result = await runWorkerTask(appid);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

