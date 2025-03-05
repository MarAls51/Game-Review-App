const express = require('express');
const router = express.Router();
const { runWorkerTask } = require('../workers/workerManager');
const OpenAI = require("openai"); 
const reviewPrompt = require("./const");
const GameReview = require("../database/mongoSchema");

const openai = new OpenAI({ 
    apiKey: process.env.OPENAI_API_KEY
});

router.get("/generalReview", async (req, res) => {
    const { appid, name } = req.query;

    if (!appid || typeof appid !== "string") {
        return res.status(400).json({ error: "Valid AppID is required" });
    }

    try {
        let gameReview = await GameReview.findOne({ name });

        if (gameReview) {
            console.log(`${name} has been queried from the database`)
            return res.json(gameReview);
        }

        const gameData = await runWorkerTask(appid);

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { 
                    role: "system", 
                    content: "You are an AI that generates structured game reviews. Always respond with JSON." 
                },
                {
                    role: "user",
                    content: reviewPrompt(name, gameData)
                }
            ],
            response_format: { type: "json_object" },
            temperature: 0.7,
            max_tokens: 15000,
            top_p: 1,
        });
        
        const reviewContent = JSON.parse(completion.choices[0].message.content);

        gameReview = new GameReview({
            name,
            bullet_point_summary: reviewContent.bullet_point_summary,
            pros: reviewContent.pros,
            cons: reviewContent.cons,
            notable_mentions: reviewContent.notable_mentions,
            bottom_line_summary: reviewContent.bottom_line_summary,
            change_over_time: reviewContent.change_over_time,
            grade: reviewContent.grade,
            developer_reputation: reviewContent.developer_reputation,
            review_weight: reviewContent.review_weight,
            deep_dive: ""
        });

        await gameReview.save();
        console.log(`${name} has successfully been stored in the database`)
        res.json(gameReview);
    } catch (err) {
        console.error("Error:", err.response?.data || err.message);
        res.status(500).json({ error: "Failed to generate or fetch review" });
    }
});

module.exports = router;
