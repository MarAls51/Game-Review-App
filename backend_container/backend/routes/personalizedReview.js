const express = require('express');
const router = express.Router();
const { generatePersonalizedReview } = require("../controllers/personalReviewController");
const logger = require('../utils/logger');

router.get("/personalizedReview", async (req, res) => {
    const { sub, name } = req.query;
    
    if (!sub || typeof sub !== "string") {
        return res.status(400).json({ error: "Valid user sub is required" });
    }

    try {
        const review = await generatePersonalizedReview(sub, name);

        if (!review) {
            return res.status(404).json({ error: "Review not found" });
        }

        return res.json(review);
    } catch (err) {
        logger.error(`Error generating personalized review: ${err.message || err}`);
        return res.status(500).json({ error: "Failed to generate or save review" });
    }
});

module.exports = router;
