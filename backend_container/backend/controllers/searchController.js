const { getTwitchAccessToken } = require("../services/twitchService");
const { searchIGDBGames } = require("../services/igdbService");
const { searchSteamGames } = require("../services/steamService");
const logger = require('../utils/logger');

async function searchGames(query) {
    if (!query) {
        logger.error("Query parameter is missing in the search request");
        throw new Error("Query parameter is required");
    }

    try {
        logger.info(`Searching for games with query: ${query}`);

        const [steamGames, accessToken] = await Promise.all([
            searchSteamGames(query),
            getTwitchAccessToken(),
        ]);

        logger.info("Successfully fetched Steam games and Twitch access token");

        const validSteamGames = steamGames.filter(game => game.description && game.description.trim().length > 0);
        
        const igdbGames = await searchIGDBGames(query, accessToken);
        logger.info("Successfully fetched IGDB games");

        const combinedGames = [];
        const uniqueGameNames = new Set();

        [...validSteamGames, ...igdbGames].forEach((game) => {
            const loweredName = game.name.toLowerCase();
            if (!uniqueGameNames.has(loweredName)) {
                uniqueGameNames.add(loweredName);
                combinedGames.push(game);
            }
        });

        return combinedGames.slice(0, 10);
    } catch (error) {
        logger.error(`Error during game search: ${error.message}`);
        throw new Error(`Error searching for games: ${error.message}`);
    }
}


module.exports = {
    searchGames,
};
