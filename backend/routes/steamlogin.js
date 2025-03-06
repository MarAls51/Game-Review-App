const express = require("express");
const Steam = require('node-steam-openid');
const axios = require("axios");

const STEAM_API_KEY = process.env.STEAM_API_KEY;
const STEAM_USER_API_URL = "https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/";

const router = express.Router();

const steam = new Steam({
    apiKey: STEAM_API_KEY,
    realm: process.env.BACKEND_URL, 
    returnUrl: `${process.env.BACKEND_URL}api/login/callback`
});

router.get('/login', async (req, res) => {
    try {
        const url = await steam.getRedirectUrl();
        console.log("Redirect URL:", url); 

        res.redirect(url);
        console.log("Redirected to Steam");

    } catch (error) {
        console.error('Error generating redirect URL:', error);
        res.status(500).send('Error generating Steam redirect URL');
    }
});

router.get('/login/callback', async (req, res) => {
    try {
        const user = await steam.authenticate(req);

        // const response = await axios.get(STEAM_USER_API_URL, {
        //     params: {
        //         key: STEAM_API_KEY,
        //         steamid: user.steamid,
        //         include_played_free_games: true,
        //         format: "json",
        //     }
        // });

        console.log("Steam ID:", user.steamid);
        const games = response.data.response.games;

        res.redirect(`${process.env.FRONTEND_URL}account`);

    } catch (error) {
        console.error('Steam login error:', error);
        res.redirect(`${process.env.FRONTEND_URL}account`); 
    }
});

module.exports = router;
