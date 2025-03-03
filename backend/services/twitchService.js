const axios = require("axios");

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
    tokenExpirationTime = Date.now() + response.data.expires_in * 1000;
    return accessToken;
  } catch (error) {
    console.error("Error fetching Twitch OAuth token:", error);
    throw new Error("Unable to fetch Twitch OAuth token");
  }
}

module.exports = { getTwitchAccessToken };
