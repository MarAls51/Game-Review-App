const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const logger = require('../utils/logger');
const User = require('../models/userSchema');

async function validateGamertag(sub, gamerTag) {
  const gamesDataPath = `games_${gamerTag}.json`;
  const pythonPath = path.join(__dirname, '../../scrapers/env/Scripts/python');
  const scriptPath = path.join(__dirname, '../../scrapers/MicrosoftScraper.py');
  
  logger.info(`Validating Xbox gamertag: ${gamerTag} for user: ${sub}`);

  const pythonProcess = spawn(pythonPath, [scriptPath, gamerTag]);
  let pythonOutput = '';
  let pythonError = '';

  return new Promise((resolve, reject) => {
    pythonProcess.stdout.on('data', (data) => {
      pythonOutput += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      pythonError += data.toString();
    });

    pythonProcess.on('close', async (code) => {
      if (code !== 1) {
        logger.error(`Invalid Xbox gamertag: ${gamerTag}, error: ${pythonError}`);
        return reject({ message: 'Invalid Xbox gamertag', details: pythonError });
      }

      if (!fs.existsSync(gamesDataPath)) {
        logger.error(`${gamesDataPath} file not found.`);
        return reject({ message: `${gamesDataPath} file not found` });
      }

      const gameData = JSON.parse(fs.readFileSync(gamesDataPath));
      let userData = await User.findOne({ sub });

      if (!userData) {
        logger.error(`User not found: ${sub}`);
        return reject({ message: 'User not found' });
      }

      userData.xbox.xboxGamertag = gamerTag;
      userData.xbox.games = gameData;
      await userData.save();

      fs.unlinkSync(gamesDataPath);

      logger.info(`Xbox gamertag validated successfully: ${gamerTag} for user: ${sub}`);
      resolve({ gamertag: gamerTag, isValid: true, games: gameData });
    });

    pythonProcess.on('error', (err) => {
      logger.error(`Failed to execute Python script for gamertag ${gamerTag}: ${err.message}`);
      reject({ message: 'Failed to execute Python script', error: err.message });
    });
  });
}

module.exports = { validateGamertag };
