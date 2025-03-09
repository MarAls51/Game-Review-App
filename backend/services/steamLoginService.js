const axios = require("axios");
const Steam = require("node-steam-openid");
const logger = require('../utils/logger');

const STEAM_API_KEY = process.env.STEAM_API_KEY;
const STEAM_USER_API_URL = "https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/";
const STEAM_APPS_LIST_URL = "https://api.steampowered.com/ISteamApps/GetAppList/v2/";

const steam = new Steam({
    apiKey: STEAM_API_KEY,
    realm: process.env.BACKEND_URL,
    returnUrl: `${process.env.BACKEND_URL}api/login/callback`,
});

let steamAppList = {};

async function fetchSteamAppList() {
    try {
        logger.info("Fetching Steam app list...");
        const response = await axios.get(STEAM_APPS_LIST_URL);
        if (response.data?.applist?.apps) {
            steamAppList = response.data.applist.apps.reduce((acc, app) => {
                acc[app.appid] = app.name;
                return acc;
            }, {});
            logger.info("Steam app list fetched successfully.");
        } else {
            logger.warn("Failed to fetch Steam app list.");
        }
    } catch (error) {
        logger.error("Error fetching Steam app list:", error);
    }
}

fetchSteamAppList();

async function getSteamRedirectUrl() {
    logger.info("Getting Steam redirect URL...");
    return await steam.getRedirectUrl();
}

async function authenticateSteamUser(req) {
    logger.info("Authenticating Steam user...");
    return await steam.authenticate(req);
}

async function fetchUserGames(steamid) {
    try {
        logger.info(`Fetching games for Steam user: ${steamid}`);
        const response = await axios.get(STEAM_USER_API_URL, {
            params: {
                key: STEAM_API_KEY,
                steamid,
                include_played_free_games: true,
                format: "json",
            },
        });

        if (response.data?.response?.games) {
            return response.data.response.games.map(game => ({
                appid: game.appid,
                name: steamAppList[game.appid] || "Unknown Game",
                playtime_forever: game.playtime_forever || 0,
            }));
        }

        logger.warn("No games found for user:", steamid);
        return [];
    } catch (error) {
        logger.error("Error fetching Steam games:", error);
        return [];
    }
}

module.exports = { getSteamRedirectUrl, authenticateSteamUser, fetchUserGames };
