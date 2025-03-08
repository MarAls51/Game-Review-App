const express = require("express");
const session = require("express-session");
const axios = require("axios");
const Steam = require("node-steam-openid");
const User = require("../database/userSchema");

const STEAM_API_KEY = process.env.STEAM_API_KEY;
const STEAM_USER_API_URL = "https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/";
const STEAM_APPS_LIST_URL = "https://api.steampowered.com/ISteamApps/GetAppList/v2/";

const router = express.Router();

const steam = new Steam({
    apiKey: STEAM_API_KEY,
    realm: process.env.BACKEND_URL,
    returnUrl: `${process.env.BACKEND_URL}api/login/callback`,
});

router.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV === "production" },
}));

let steamAppList = {};

async function fetchSteamAppList() {
    try {
        console.log("Fetching Steam app list...");
        const response = await axios.get(STEAM_APPS_LIST_URL);
        if (response.data && response.data.applist && response.data.applist.apps) {
            steamAppList = response.data.applist.apps.reduce((acc, app) => {
                acc[app.appid] = app.name;
                return acc;
            }, {});
            console.log("Steam app list fetched successfully.");
        } else {
            console.warn("Failed to fetch Steam app list.");
        }
    } catch (error) {
        console.error("Error fetching Steam app list:", error);
    }
}

fetchSteamAppList();

router.get("/login", async (req, res) => {
    const { sub } = req.query;
    try {
        req.session.sub = sub;
        const url = await steam.getRedirectUrl();
        console.log("Redirect URL:", url);
        res.redirect(url);
    } catch (error) {
        console.error("Error generating redirect URL:", error);
        res.status(500).send("Error generating Steam redirect URL");
    }
});

router.get("/login/callback", async (req, res) => {
    try {
        const sub = req.session.sub;
        delete req.session.sub;

        if (!sub) {
            return res.status(400).json({ message: "sub parameter is missing from session" });
        }

        const steamUser = await steam.authenticate(req);
        console.log("Steam ID:", steamUser.steamid);

        const userData = await User.findOne({ sub });
        if (!userData) {
            return res.status(404).json({ message: "User not found for sub: " + sub });
        }

        userData.steam = {
            steamid: steamUser.steamid,
            games: [],
        };
        await userData.save();

        console.log("Fetching Steam games for user:", sub);

        const response = await axios.get(STEAM_USER_API_URL, {
            params: {
                key: STEAM_API_KEY,
                steamid: steamUser.steamid,
                include_played_free_games: true,
                format: "json",
            },
        });

        if (response.data.response && response.data.response.games) {
            const ownedGames = response.data.response.games.map(game => ({
                appid: game.appid,
                name: steamAppList[game.appid] || "Unknown Game",
                playtime_forever: game.playtime_forever || 0,
            }));

            userData.steam.games = ownedGames;
            await userData.save();
            console.log("Steam games updated for user:", sub);
        } else {
            console.warn("No games found for user:", sub);
        }

        res.redirect(`${process.env.FRONTEND_URL}account`);
    } catch (error) {
        console.error("Steam login error:", error);
        res.redirect(`${process.env.FRONTEND_URL}account`);
    }
});

module.exports = router;
