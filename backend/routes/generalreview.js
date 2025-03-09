const express = require('express');
const router = express.Router();
const { getGeneralReview } = require("../controllers/reviewController");

router.get("/generalReview", getGeneralReview);

module.exports = router;
