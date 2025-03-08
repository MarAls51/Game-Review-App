const express = require('express');
const router = express.Router();
const OpenAI = require("openai");
const { personalizedReviewPrompt } = require("./const");
const GameReview = require("../database/mongoSchema");
const User = require("../database/userSchema");

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

async function fetchGameReviewFromDatabase(name) {
    return await GameReview.findOne({ name });
}

async function generateReviewContent(name, gameReview, steamData, xboxData) {
    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            { role: "system", content: "You are an AI that generates structured game reviews for individual users based on their game library and play history. Always respond with JSON." },
            { role: "user", content: personalizedReviewPrompt(name, gameReview, steamData, xboxData) }
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
        max_tokens: 16000,
        top_p: 1,
    });

    return JSON.parse(completion.choices[0].message.content);
}

async function getUserGameData(sub) {
    const user = await User.findOne({ sub });

    if (!user) {
        throw new Error(`User with sub ${sub} not found`);
    }

    return {
        user,
        steamData: user.steam?.games || {},
        xboxData: user.xbox?.games || {},
    };
}

router.get("/personalizedReview", async (req, res) => {
    const { sub, name } = req.query;
    
    if (!sub || typeof sub !== "string") {
        return res.status(400).json({ error: "Valid user sub is required" });
    }

    try {
        const { user, steamData, xboxData } = await getUserGameData(sub);

        const existingReview = user.personal_reviews.find(r => r.game_title === name);
        if (existingReview) {
            console.log(`Returning existing review for ${name} for user ${sub}`);
            return res.json(existingReview);
        }

        const gameReview = await fetchGameReviewFromDatabase(name);
        if (!gameReview) {
            console.log(`${name} game review not found`);
            return res.status(404).json({ error: "Game review not found" });
        }

        const reviewContent = await generateReviewContent(name, gameReview, steamData, xboxData);

        const personalReview = {
            game_title: name,
            comparison: reviewContent.comparison,
            review: reviewContent.review
        };
        
        user.personal_reviews.push(personalReview);
        await user.save();

        console.log(`Personalized review for ${name} has been stored for user ${sub}`);

        return res.json(reviewContent); 

    } catch (err) {
        console.error("Error:", err.message || err);
        return res.status(500).json({ error: "Failed to generate or save review" }); 
    }
});


module.exports = router;
