const express = require("express");
const router = express.Router()
const userRoutes = require('./userRoutes')
const betRoutes = require('./betRoutes')

router.use("/users",userRoutes)
router.use("/bets",betRoutes)

module.exports = router