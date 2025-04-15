const axios = require("axios");
const logger = require("../utils/logger");

async function searchSteamGames(query) {
  try {
    logger.info(`Searching for Steam games with query: ${query}`);

    const searchResponse = await axios.get(
      `https://steamcommunity.com/actions/SearchApps/${query}`
    );
    const searchResults = searchResponse.data.slice(0, 5);

    if (searchResults.length === 0) {
      logger.warn("No Steam games found for the query.");
      return [];
    }

    const appIDs = searchResults.map((app) => app.appid);

    const detailsRequests = appIDs.map((appid) =>
      axios.get(`https://store.steampowered.com/api/appdetails`, {
        params: { appids: appid },
      })
    );

    const detailsResponses = await Promise.all(detailsRequests);

    return detailsResponses
      .map((response, index) => {
        const appID = appIDs[index];
        const gameData = response.data[appID]?.data;

        if (!gameData || typeof gameData !== "object") {
          return null;
        }

        const hasAdultRating = Object.values(gameData.ratings || {}).some(
          (rating) => {
            const age = parseInt(rating.required_age, 10);
            return !isNaN(age) && age >= 18;
          }
        );

        if (hasAdultRating) {
          return null;
        }

        return {
          type: "steam",
          appid: appID,
          name: searchResults[index].name,
          description: gameData.short_description,
          screenshots: gameData.screenshots
            ? gameData.screenshots.map((screenshot) => ({
                path_full: screenshot.path_full,
              }))
            : [],
          movies: gameData.movies
            ? gameData.movies.map((movie) => ({
                url: movie.mp4.max.replace("http://", "https://"),
              }))
            : [],
        };
      })
      .filter(Boolean);
  } catch (error) {
    logger.error("Error searching Steam games:", error);
    return [];
  }
}

module.exports = { searchSteamGames };