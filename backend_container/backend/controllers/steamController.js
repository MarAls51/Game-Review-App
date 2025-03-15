const { getSteamRedirectUrl, authenticateSteamUser, fetchUserGames } = require("../services/steamLoginService");
const User = require("../models/userSchema");
const logger = require('../utils/logger');

async function login(req, res) {
    try {
        if (!sub) {
            logger.error("sub parameter is missing from session during Steam login");
            return res.status(400).json({ message: "sub parameter is missing from session" });
        }

        const url = await getSteamRedirectUrl();
        logger.info(`Redirecting user ${req.query.sub} to Steam login URL`);
        res.redirect(url);
    } catch (error) {
        logger.error(`Error generating Steam redirect URL for sub ${req.query.sub}: ${error.message}`);
        res.status(500).send("Error generating Steam redirect URL");
    }
}

async function loginCallback(req, res) {
    try {
        const sub = req.session.user?.id;
        if (!sub) {
            logger.warn("sub parameter is missing from session during Steam callback");
            return res.status(400).json({ message: "sub parameter is missing from session" });
        }

        const steamUser = await authenticateSteamUser(req);
        const userData = await User.findOne({ sub });

        if (!userData) {
            logger.warn(`User not found for sub: ${sub}`);
            return res.status(404).json({ message: "User not found for sub: " + sub });
        }

        logger.info(`Updating user data for sub: ${sub} with Steam ID: ${steamUser.steamid}`);
        userData.steam = { steamid: steamUser.steamid, games: [] };
        await userData.save();

        const ownedGames = await fetchUserGames(steamUser.steamid);
        if (ownedGames) {
            logger.info(`Fetched owned games for user ${sub}`);
            userData.steam.games = ownedGames;
            await userData.save();
        }

        logger.info(`Successfully authenticated and updated user ${sub}, redirecting to account page`);
        res.redirect(`${process.env.FRONTEND_URL}account`);
    } catch (error) {
        logger.error(`Steam login error for sub ${req.session.sub}: ${error.message}`);
        res.redirect(`${process.env.FRONTEND_URL}account`);
    }
}

module.exports = { login, loginCallback };
