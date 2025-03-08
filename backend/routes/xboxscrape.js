const express = require('express');
const router = express.Router();
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const User = require('../database/userSchema');

require('dotenv').config();

router.get('/validate-xbox-gamertag', async (req, res) => {
  const { sub, gamerTag } = req.query;

  if (!sub || !gamerTag) {
    console.log('Missing required parameters: sub or gamerTag');
    return res.status(400).json({ message: 'sub and gamerTag are required' });
  }

  const gamesDataPath = `games_${gamerTag}.json`

  try {
    console.log(`Validating Xbox gamertag: ${gamerTag} for sub: ${sub}`);

    const pythonPath = path.join(__dirname, '../../scrapers/env/Scripts/python');
    const scriptPath = path.join(__dirname, '../../scrapers/MicrosoftScraper.py');

    const pythonProcess = spawn(pythonPath, [scriptPath, gamerTag]);

    let pythonOutput = '';
    let pythonError = '';

    pythonProcess.stdout.on('data', (data) => {
      pythonOutput += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      pythonError += data.toString();
    });

    pythonProcess.on('close', async (code) => {
      if (code === 1) {
        console.log(`Gamertag ${gamerTag} is valid.`);

        if (!fs.existsSync(gamesDataPath)) {
          console.log('games_data.json file does not exist.');
          return res.status(500).json({ message: `${gamesDataPath} file not found` });
        }

        const gameData = JSON.parse(fs.readFileSync(gamesDataPath));

        let userData = await User.findOne({ sub });

        if (!userData) {
          console.log(`User not found for sub: ${sub}. No update performed.`);
          return res.status(404).json({ message: "User not found. No update performed." });
        }

        userData.xbox.xboxGamertag = gamerTag;
        userData.xbox.games = gameData;
        await userData.save();

        console.log(`Gamertag ${gamerTag} and game progress updated successfully for user ${sub}`);

        fs.unlinkSync(gamesDataPath);
        console.log(`${gamesDataPath} file deleted successfully.`);

        return res.status(200).json({ gamertag: gamerTag, isValid: true, games: gameData });
      } else {
        console.log(`Invalid gamertag ${gamerTag} for sub: ${sub}`);
        return res.status(400).json({ message: 'Invalid Xbox gamertag', details: pythonError });
      }
    });

    pythonProcess.on('error', (err) => {
      console.error(`Error executing Python script for sub: ${sub}`, err);
      res.status(500).json({ message: 'Failed to execute Python script', error: err.message });
    });
  } catch (error) {
    console.error(`Error validating gamertag for sub: ${sub}`, error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
