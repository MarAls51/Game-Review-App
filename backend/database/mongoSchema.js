const mongoose = require("mongoose");

const gameReviewSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  bullet_point_summary: {
    graphics: String,
    gameplay: String,
    audio: String,
    audience: [String],
    pc_requirements: String,
    difficulty: String,
    grind: String,
    story: String,
    game_time: String,
    price: String,
    bugs: String
  },
  pros: String,
  cons: String,
  notable_mentions: String,
  bottom_line_summary: String,
  change_over_time: String,
  grade: String,
  developer_reputation: String,
  review_weight: Number,
  deep_dive: Object,
  metrics: Object
});

const GameReview = mongoose.model("GameReview", gameReviewSchema);

module.exports = GameReview;
