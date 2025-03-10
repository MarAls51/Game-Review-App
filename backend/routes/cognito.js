const express = require("express");
const router = express.Router();
const logger = require('../utils/logger');

router.get("/auth-config", (req, res) => {
  try {
    logger.error("Loading congnito configuration env");
    const config = {
        authority: process.env.AUTHORITY,
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        redirect_uri: process.env.REDIRECT_URL,
        response_type: process.env.RESPONSE_TYPE,
        post_logout_redirect_uri: process.env.LOGOUT_URL,
        scope: process.env.SCOPE,
    };

    if (!config.authority || !config.client_id) {
        logger.error("Missing authentication environment variables");
    }

    res.json(config);
  } catch (error) {
    logger.error("Error fetching auth config:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;

