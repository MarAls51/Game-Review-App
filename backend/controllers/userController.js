const User = require('../models/userSchema');
const logger = require('../utils/logger');

async function getUser(req, res) {
  const { sub } = req.query;
  try {
    logger.info(`Fetching user data for sub: ${sub}`);
    const userData = await User.findOne({ sub });

    if (!userData) {
      logger.warn(`User not found for sub: ${sub}`);
      return res.status(404).json({ message: 'User not found' }); 
    }

    logger.info(`User data retrieved successfully for sub: ${sub}`);
    return res.json(userData);
  } catch (error) {
    logger.error(`Error fetching user data for sub: ${sub}`, error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

async function createUser(req, res) {
  const { sub, alias } = req.body;
  try {
    logger.info(`Creating user data for sub: ${sub}, alias: ${alias}`);
    
    const userData = new User({
      sub,
      alias,
      xbox: {},
      steam: {},
      playstation: null,
      epicgames: null,
      testimonial: null,
    });
    
    await userData.save();
    logger.info(`User created successfully for sub: ${sub}`);
    res.status(201).json(userData);
  } catch (error) {
    logger.error(`Error creating user for sub: ${sub}`, error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

async function updateUser(req, res) {
  const { sub, alias, testimonial, steam, xbox, playstation } = req.body;

  try {
    logger.info(`Updating user data for sub: ${sub}, alias: ${alias}, testimonial: ${testimonial}`);

    let userData = await User.findOne({ sub });

    if (!userData) {
      logger.warn(`User not found for sub: ${sub}`);
      return res.status(404).json({ message: "User not found", sub });
    }

    if (alias !== undefined) userData.alias = alias;
    if (testimonial !== undefined) userData.testimonial = testimonial;
    if (steam !== undefined) userData.steam = steam;
    if (xbox !== undefined) userData.xbox = xbox;
    if (playstation !== undefined) userData.playstation = playstation;

    await userData.save();
    logger.info(`User updated successfully for sub: ${sub}`);
    return res.json(userData);
  } catch (error) {
    logger.error(`Error updating user data for sub: ${sub}`, error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

async function deleteUser(req, res) {
  const { sub } = req.body;

  try {
    logger.info(`Attempting to delete user with sub: ${sub}`);

    const userData = await User.findOneAndDelete({ sub });

    if (!userData) {
      logger.warn(`User not found for sub: ${sub}`);
      return res.status(404).json({ message: 'User not found' });
    }

    logger.info(`User deleted successfully for sub: ${sub}`);
    return res.json({ message: 'User deleted successfully', sub });
  } catch (error) {
    logger.error(`Error deleting user for sub: ${sub}`, error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

async function getUserTestimonials(req, res) {
  try {
    const users = await User.find({ testimonial: { $ne: "" } }, 'alias testimonial');
    logger.info(`Fetched user testimonials successfully`);
    res.json(users);
  } catch (error) {
    logger.error("Error fetching testimonials:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

module.exports = { getUser, createUser, updateUser, deleteUser, getUserTestimonials };
