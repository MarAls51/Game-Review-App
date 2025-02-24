const express = require("express");
const axios = require("axios");
const router = express.Router();

router.get("/api/search", async (req, res) => {
  const query = req.query.query;

  if (!query) {
    return res.status(400).json({ error: "Query parameter is required" });
  }

  try {
    const searchResponse = await axios.get(`https://steamcommunity.com/actions/SearchApps/${query}`);

    const searchResults = searchResponse.data.slice(0, 10);

    if (searchResults.length === 0) {
      return res.json({ message: "No results found." });
    }

    const appIDs = searchResults.map((app) => app.appid);

    const detailsRequests = appIDs.map((appid) =>
      axios.get(`https://store.steampowered.com/api/appdetails`, {
        params: { appids: appid },
      })
    );

    const detailsResponses = await Promise.all(detailsRequests);

    const detailedGames = detailsResponses.map((response, index) => ({
      appid: appIDs[index],
      name: searchResults[index].name,
      details: response.data[appIDs[index]]?.data || null,
    }));

    res.json(detailedGames);

  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching data." });
  }
});

module.exports = router;
