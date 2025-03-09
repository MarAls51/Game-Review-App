const express = require('express');
const router = express.Router();
const { validateGamertag } = require('../services/xboxService');
const logger = require('../utils/logger');

router.get('/validate-xbox-gamertag', async (req, res) => {
    const { sub, gamerTag } = req.query;

    if (!sub || !gamerTag) {
        logger.error(`${sub} or ${gamerTag} is undefined, unable to scrape xbox data.`);
        return res.status(400).json({ message: "Server Error" });
    }

    try {
        const result = await validateGamertag(sub, gamerTag);
        return res.json(result);
    } catch (error) {
        logger.error(`Error validating Xbox gamertag: ${error.message}`);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
