const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  sub: { type: String, required: true, unique: true },
  alias: { type: String, default: 'Guest' },
  steam: {
    steamid: { type: String, default: '' },
    games: { type: Object, default: {} },
  },
  xbox: {
    xboxGamertag: { type: String, default: '' },
    games: { type: Object, default: {} },
  },
  playstation: {
    playstationGamertag: { type: String, default: '' },
    games: { type: Object, default: {} },
  },
  testimonial: { type: String, default: '' },
  personal_reviews: [
    {
      game_title: {type: String},
      comparison: { type: String}, 
      review: { type: String },
    },
  ],
});

module.exports = mongoose.model('User', userSchema);

const User = mongoose.model('User', userSchema);

module.exports = User;
