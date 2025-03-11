const OpenAI = require("openai");
const GameReview = require("../models/mongoSchema");
const User = require("../models/userSchema");
const { personalizedReviewPrompt } = require("../utils/const");
const logger = require('../utils/logger');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

async function fetchGameReviewFromDatabase(name) {
    logger.info(`Attempting to fetch game review for: ${name}`);
    const gameReview = await GameReview.findOne({ name });
    
    if (!gameReview) {
        logger.warn(`Game review not found for: ${name}`);
    } else {
        logger.info(`Successfully fetched game review for: ${name}`);
    }
    
    return gameReview;
}

async function generateReviewContent(name, gameReview, steamData, xboxData) {
    logger.info(`Generating review content for: ${name}`);
    
    try {
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

        const reviewContent = JSON.parse(completion.choices[0].message.content);
        logger.info(`Successfully generated review content for: ${name}`);
        return reviewContent;
    } catch (error) {
        logger.error(`Error generating review content for ${name}: ${error.message}`);
        throw new Error(`Error generating review content for ${name}`);
    }
}

async function getUserGameData(sub) {
    logger.info(`Fetching user data for sub: ${sub}`);

    const user = await User.findOne({ sub });

    if (!user) {
        logger.error(`User with sub ${sub} not found`);
        throw new Error(`User with sub ${sub} not found`);
    }

    logger.info(`Successfully fetched user data for sub: ${sub}`);
    return {
        user,
        steamData: user.steam?.games || {},
        xboxData: user.xbox?.games || {},
    };
}
async function generatePersonalizedReview(sub, name) {
    logger.info(`Generating personalized review for ${name} and user ${sub}`);
    
    const { user, steamData, xboxData } = await getUserGameData(sub);

    if ((steamData.length + xboxData.length) < 20) {
        logger.warn("Not enough data: Combined Xbox and Steam games are less than 20.");
        throw new Error("Not enough data: Combined Xbox and Steam games are less than 20.");
    }

    const existingReview = user.personal_reviews.find(r => r.game_title === name);
    if (existingReview) {
        logger.info(`Returning existing review for ${name} for user ${sub}`);
        return existingReview;
    }

    const gameReview = await fetchGameReviewFromDatabase(name);
    if (!gameReview) {
        logger.warn(`${name} game review not found for user ${sub}`);
        throw new Error("Game review not found");
    }

    const reviewContent = await generateReviewContent(name, gameReview, steamData, xboxData);

    const personalReview = {
        game_title: name,
        comparison: reviewContent.comparison,
        review: reviewContent.review
    };

    user.personal_reviews.push(personalReview);
    await user.save();

    logger.info(`Personalized review for ${name} has been stored for user ${sub}`);
    return reviewContent;
}

module.exports = {
    generatePersonalizedReview
};
