const express = require("express");
const { login, loginCallback } = require("../controllers/steamController");

const router = express.Router();

router.get("/login", login);
router.get("/login/callback", loginCallback);

module.exports = router;
