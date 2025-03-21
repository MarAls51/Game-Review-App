const express = require("express");
const router = express.Router();
const logger = require("../utils/logger");
const fs = require('fs');

router.get("/auth-config", (req, res) => {
  try {
    logger.info("Loading Cognito configuration env");

    const config = {
      authority: fs.readFileSync('/run/secrets/AUTHORITY', 'utf8').trim(),
      client_id: fs.readFileSync('/run/secrets/CLIENT_ID', 'utf8').trim(),
      redirect_uri: fs.readFileSync('/run/secrets/REDIRECT_URL', 'utf8').trim(),
      response_type:fs.readFileSync('/run/secrets/RESPONSE_TYPE', 'utf8').trim(),
      post_logout_redirect_uri: fs.readFileSync('/run/secrets/LOGOUT_URL', 'utf8').trim(),
      scope: fs.readFileSync('/run/secrets/SCOPE', 'utf8'),
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


router.get('/logout', (req, res) => {
  res.redirect(fs.readFileSync('/run/secrets/logoutUrl', 'utf8'));
});

module.exports = router;