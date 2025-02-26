const express = require("express");
const axios = require("axios");
const router = express.Router();
require('dotenv').config();
const fs = require("fs");

const TWITCH_API_KEY = process.env.TWITCH_API_KEY;
const TWITCH_CLIENT_KEY = process.env.TWITCH_CLIENT_KEY;

let accessToken = null;
let tokenExpirationTime = null;

async function getTwitchAccessToken() {
  try {
    if (accessToken && Date.now() < tokenExpirationTime) {
      return accessToken;
    }

    const response = await axios.post("https://id.twitch.tv/oauth2/token", null, {
      params: {
        client_id: TWITCH_CLIENT_KEY,
        client_secret: TWITCH_API_KEY,
        grant_type: "client_credentials",
      },
    });

    accessToken = response.data.access_token;
    tokenExpirationTime = Date.now() + (response.data.expires_in * 1000);
    return accessToken;
  } catch (error) {
    console.error("Error fetching Twitch OAuth token:", error);
    throw new Error("Unable to fetch Twitch OAuth token");
  }
}

async function searchIGDBGames(query, accessToken) {
  try {
    const response = await axios.post(
      "https://api.igdb.com/v4/games",
      `fields id, name, summary, screenshots.*, videos.video_id; search "${query}"; limit 5;`,
      {
        headers: {
          "Client-ID": TWITCH_CLIENT_KEY,
          "Authorization": `Bearer ${accessToken}`,
          "Accept": "application/json",
        },
      }
    );

    const formattedGames = response.data.map((game) => ({
      type: "igdb",
      appid: game.id,
      name: game.name,
      description: game.summary,
      screenshots: game.screenshots?.map((screenshot) => ({
        path_full: screenshot.url.replace("t_thumb", "t_1080p"),
      })) || [],
      movies: game.videos
        ? game.videos.map((video) => ({
            url: `https://www.youtube.com/watch?v=${video.video_id}`,
          }))
        : [],
    }));

    return formattedGames;
  } catch (error) {
    console.error("Error searching IGDB games:", error);
    return [];
  }
}


async function searchSteamGames(query) {
  try {
    const searchResponse = await axios.get(`https://steamcommunity.com/actions/SearchApps/${query}`);
    const searchResults = searchResponse.data.slice(0, 5);

    if (searchResults.length === 0) return [];

    const appIDs = searchResults.map((app) => app.appid);

    const detailsRequests = appIDs.map((appid) =>
      axios.get(`https://store.steampowered.com/api/appdetails`, { params: { appids: appid } })
    );

    const detailsResponses = await Promise.all(detailsRequests);

    return detailsResponses.map((response, index) => ({
      type: "steam",
      appid: appIDs[index],
      name: searchResults[index].name,
      description: response.data[appIDs[index]]?.data.short_description,
      screenshots: response.data[appIDs[index]]?.data.screenshots,
      screenshots: response.data[appIDs[index]]?.data.screenshots ? response.data[appIDs[index]]?.data.screenshots.map(screenshot => ({
        path_full: screenshot.path_full, 
      })) : [],
      movies: response.data[appIDs[index]]?.data.movies ? response.data[appIDs[index]]?.data.movies.map(movie => ({
        url: movie.mp4.max, 
      })) : [],
    }));
  } catch (error) {
    console.error("Error searching Steam games:", error);
    return [];
  }
}

router.get("/api/search", async (req, res) => {
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
      if (!uniqueGameNames.has(game.name)) {
        uniqueGameNames.add(game.name);
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
