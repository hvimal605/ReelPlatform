const express = require("express");
const router = express.Router();




const { getUserProfile,  updateProfile } = require("../controller/User");
const { auth } = require("../middleware/auth");
const { updateDisplayPicture } = require("../controller/User");

// Create reel
router.post("/getProfile",  getUserProfile);
router.put("/updateProfile", auth, updateProfile);
router.put("/updateDisplayPicture", auth, updateDisplayPicture)



module.exports = router;
