const express = require('express');
const router = express.Router();
const User = require('../database/userSchema');


router.get('/user-data', async (req, res) => {
  const { sub } = req.query;
  try {
    console.log(`Fetching user data for sub: ${sub}`);
    let userData = await User.findOne({ sub });

    if (!userData) {
      console.log(`User not found for sub: ${sub}`);
      return res.status(404);
    }

    console.log(`User data retrieved successfully for sub: ${sub}`);
    return res.json(userData);
  } catch (error) {
    console.error(`Error fetching user data for sub: ${sub}`, error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/user-data', async (req, res) => {
  const { sub, alias } = req.body;
  try {
    console.log(`Creating user data for sub: ${sub}, alias: ${alias}`);
    
    const userData = new User({
      sub,
      alias: alias,
      steam: '',
      playstation: '',
      epicgames: '',
      testimonial: '',
    });
    
    await userData.save();
    console.log(`User created successfully for sub: ${sub}`);
    res.status(201).json(userData);
  } catch (error) {
    console.error(`Error creating user for sub: ${sub}`, error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put('/user-data', async (req, res) => {
  const { sub, alias, testimonial } = req.body;
  try {
    console.log(`Updating user data for sub: ${sub}, alias: ${alias}, testimonial: ${testimonial}`);

    let userData = await User.findOne({ sub });

    if (!userData) {
      console.log(`User not found for sub: ${sub}`);
      return res.status(404).json({ message: "User not found", sub });
    }

    if (alias !== undefined) {
      userData.alias = alias;
    }

    if (testimonial !== undefined) {
      userData.testimonial = testimonial;
    }

    await userData.save();
    console.log(`User updated successfully for sub: ${sub}`);
    return res.json(userData);
  } catch (error) {
    console.error(`Error updating user data for sub: ${sub}`, error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;


