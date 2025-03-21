const axios = require("axios");
const logger = require('../utils/logger');
const fs = require('fs');

const TWITCH_API_KEY = fs.readFileSync('/run/secrets/TWITCH_API_KEY', 'utf8').trim();
const TWITCH_CLIENT_KEY = fs.readFileSync('/run/secrets/TWITCH_CLIENT_KEY', 'utf8').trim();

let accessToken = null;
let tokenExpirationTime = null;

async function getTwitchAccessToken() {
  try {
    if (accessToken && Date.now() < tokenExpirationTime) {
      logger.info("Returning existing Twitch access token.");
      return accessToken;
    }

    logger.info("Fetching new Twitch access token...");

    const response = await axios.post("https://id.twitch.tv/oauth2/token", null, {
      params: {
        client_id: TWITCH_CLIENT_KEY,
        client_secret: TWITCH_API_KEY,
        grant_type: "client_credentials",
      },
    });

    accessToken = response.data.access_token;
    tokenExpirationTime = Date.now() + response.data.expires_in * 1000;

    logger.info("Twitch access token fetched successfully.");
    return accessToken;
  } catch (error) {
    logger.error("Error fetching Twitch OAuth token:", error);
    throw new Error("Unable to fetch Twitch OAuth token");
  }
}

module.exports = { getTwitchAccessToken };
