const express = require("express");
const { getTwitchAccessToken } = require("../services/twitchService");
const { searchIGDBGames } = require("../services/igdbService");
const { searchSteamGames } = require("../services/steamService");

const router = express.Router();

router.get("/search", async (req, res) => {
  const query = req.query.query;
  if (!query) {
    return res.status(400).json({ error: "Query parameter is required" });
  }

  try {
    const [steamGames, accessToken] = await Promise.all([
      searchSteamGames(query),
      getTwitchAccessToken(),
    ]);

    const igdbGames = await searchIGDBGames(query, accessToken);

    const combinedGames = [];
    const uniqueGameNames = new Set();

    [...steamGames, ...igdbGames].forEach((game) => {
      const loweredName = game.name.toLowerCase();
      if (!uniqueGameNames.has(loweredName)) {
        uniqueGameNames.add(loweredName);
        combinedGames.push(game);
      }
    });

    res.json(combinedGames.slice(0, 10));
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "An error occurred while fetching data." });
  }
});

module.exports = router;
