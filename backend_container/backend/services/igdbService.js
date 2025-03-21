const axios = require("axios");
const { getTwitchAccessToken } = require("./twitchService");
const logger = require('../utils/logger');
const fs = require('fs');

const TWITCH_CLIENT_KEY = fs.readFileSync('/run/secrets/OPENAI_API_KEY', 'utf8').trim();

async function searchIGDBGames(query, accessToken) {
  try {
    const response = await axios.post(
      "https://api.igdb.com/v4/games",
      `fields id, name, summary, screenshots.*, videos.video_id; search "${query}"; limit 5;`,
      {
        headers: {
          "Client-ID": TWITCH_CLIENT_KEY,
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
        },
      }
    );

    return response.data.map((game) => ({
      type: "igdb",
      appid: game.id,
      name: game.name,
      description: game.summary,
      screenshots: game.screenshots
        ? game.screenshots.map((screenshot) => ({
            path_full: screenshot.url.replace("t_thumb", "t_1080p"),
          }))
        : [],
      movies: game.videos
        ? game.videos.map((video) => ({
            url: `https://www.youtube.com/watch?v=${video.video_id}`,
          }))
        : [],
    }));
  } catch (error) {
    logger.error(`Error searching IGDB games: ${error.message}`);
    return [];
  }
}

module.exports = { searchIGDBGames };
