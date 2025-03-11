const OpenAI = require("openai");
const GameReview = require("../models/mongoSchema");
const { reviewPrompt, deepDiveReviewPrompt } = require("../utils/const");
const { runWorkerTask } = require("../workers/workerManager");
const logger = require('../utils/logger');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

async function fetchGameReviewFromDatabase(name) {
    logger.info(`Attempting to fetch game review for: ${name}`);
    return await GameReview.findOne({ name });
}

async function generateReviewContent(name, gameData) {
    logger.info(`Generating structured review content for: ${name}`);
    
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "You are an AI that generates structured game reviews. Always respond with JSON." },
                { role: "user", content: reviewPrompt(name, gameData) }
            ],
            response_format: { type: "json_object" },
            temperature: 0.7,
            max_tokens: 15000,
            top_p: 1,
        });

        const reviewContent = JSON.parse(completion.choices[0].message.content);
        logger.info(`Successfully generated review content for: ${name}`);
        return reviewContent;
    } catch (error) {
        logger.error(`Error generating review content for ${name}: ${error.message}`);
        throw new Error(`Error generating review content for ${name}`);
    }
}

async function generateDeepDiveContent(name, gameData) {
    logger.info(`Generating deep dive review content for: ${name}`);
    
    try {
        const deepDiveCompletion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "You are an AI that generates in-depth game reviews. Provide a detailed, at least 5-paragraph review covering gameplay, graphics, story, mechanics, and overall experience." },
                { role: "user", content: deepDiveReviewPrompt(name, gameData) }
            ],
            response_format: { type: "json_object" },
            temperature: 0.7,
            max_tokens: 15000,
            top_p: 1,
        });

        const deepDiveContent = JSON.parse(deepDiveCompletion.choices[0].message.content);
        logger.info(`Successfully generated deep dive review for: ${name}`);
        return deepDiveContent;
    } catch (error) {
        logger.error(`Error generating deep dive review for ${name}: ${error.message}`);
        throw new Error(`Error generating deep dive review for ${name}`);
    }
}

function createGameReviewObject(name, reviewContent, deepDiveContent) {
    logger.info(`Creating game review object for: ${name}`);
    return new GameReview({
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
        deep_dive: deepDiveContent,
        metrics: null,
        metric_can_scrape: true
    });
}

async function getGeneralReview(req, res) {
    const { appid, name } = req.query;

    if (!appid || typeof appid !== "string") {
        logger.warn("Invalid AppID provided in the request");
        return res.status(400).json({ error: "Valid AppID is required" });
    }

    try {
        let gameReview = await fetchGameReviewFromDatabase(name);

        if (gameReview) {
            logger.info(`${name} has been queried from the database`);
            return res.json(gameReview);
        }

        logger.info(`No existing review found for ${name}. Generating new review...`);
        const gameData = await runWorkerTask(appid);
        const reviewContent = await generateReviewContent(name, gameData);

        let deepDiveContent = {
            title: name,
            content: "Not enough data to generate an in-depth review, any review with a confidence rating less than 7 does not generate a deep dive analysis."
        };

        if (reviewContent.review_weight > 7) {
            logger.info(`Review confidence for ${name} is high, generating deep dive review...`);
            deepDiveContent = await generateDeepDiveContent(name, gameData);
        }

        gameReview = createGameReviewObject(name, reviewContent, deepDiveContent);
        await gameReview.save();
        logger.info(`${name} has successfully been stored in the database`);

        res.json(gameReview);

    } catch (err) {
        logger.error(`Error processing review for ${name}: ${err.message}`);
        res.status(500).json({ error: "Failed to generate or fetch review" });
    }
}

module.exports = { getGeneralReview };
