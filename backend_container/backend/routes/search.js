const express = require("express");
const { searchGames } = require("../controllers/searchController");
const logger = require('../utils/logger');

const router = express.Router();

router.get("/search", async (req, res) => {
    try {
        const games = await searchGames(req.query.query);
        res.json(games);
    } catch (error) {
        logger.error(`Error fetching data: ${error.message || error}`);
        res.status(500).json({ error: error.message || "An error occurred while fetching data." });
    }
});

module.exports = router;
