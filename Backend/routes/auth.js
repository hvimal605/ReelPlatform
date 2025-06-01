const express = require("express");
const { signup, login, sendOTP, checkusername } = require("../controller/Auth");
const router = express.Router();


router.post("/signup", signup);
router.post("/login", login);
router.post("/sendotp", sendOTP)
router.get('/check-username' , checkusername)

module.exports = router;
