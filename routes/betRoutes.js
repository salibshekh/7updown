const express = require("express");
const router = express.Router()
const {placeBet,getBetHistory} = require('../controller/betController')
const { authenticate } = require("../middleware/isAuth");

router.post("/placebet", authenticate, placeBet);
router.get("/getbethistory", authenticate, getBetHistory);

module.exports = router