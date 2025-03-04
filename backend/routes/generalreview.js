const express = require('express');
const router = express.Router();
const { runWorkerTask } = require('../workers/workerManager');
const OpenAI = require("openai"); 
const reviewPrompt = require("./const");

const openai = new OpenAI({ 
    apiKey: process.env.OPENAI_API_KEY
});

router.get("/generalReview", async (req, res) => {
    const { appid, name } = req.query;

    if (!appid || typeof appid !== "string") {
        return res.status(400).json({ error: "Valid AppID is required" });
    }

    try {
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

        res.json(reviewContent);
    } catch (err) {
        console.error("Error:", err.response?.data || err.message);
        res.status(500).json({ error: "Failed to generate review" });
    }
});

module.exports = router;
