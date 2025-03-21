const axios = require("axios");
const logger = require('../utils/logger');

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

    return detailsResponses.map((response, index) => ({
      type: "steam",
      appid: appIDs[index],
      name: searchResults[index].name,
      description: response.data[appIDs[index]]?.data.short_description,
      screenshots: response.data[appIDs[index]]?.data.screenshots
        ? response.data[appIDs[index]]?.data.screenshots.map((screenshot) => ({
            path_full: screenshot.path_full,
          }))
        : [],
      movies: response.data[appIDs[index]]?.data.movies
        ? response.data[appIDs[index]]?.data.movies.map((movie) => ({
            url: movie.mp4.max.replace('http://', 'https://'),
          }))
        : [],
    }));
  } catch (error) {
    logger.error("Error searching Steam games:", error);
    return [];
  }
}

module.exports = { searchSteamGames };
