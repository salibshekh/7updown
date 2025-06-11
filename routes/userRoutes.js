const express = require("express");
const router = express.Router()
const {signIn, signUp} = require('../controller/userController')

router.post("/signup",signUp)
router.post("/signin",signIn)

module.exports = router