const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  sub: { type: String, required: true, unique: true },
  alias: { type: String, default: 'Guest' },
  steam: { type: String, default: '' },
  metacritic: { type: String, default: '' },
  playstation: { type: String, default: '' },
  epicgames: { type: String, default: '' },
  testimonial: { type: String, default: '' },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
