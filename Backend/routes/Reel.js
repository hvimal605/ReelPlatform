const express = require("express");
const router = express.Router();


const Reel = require("../models/Reel");
const { uploadReel, getReelsFeed, getReelById, editReel, deleteReel, getMyReels, getReelsByUsername } = require("../controller/Reel");
const { auth, isReelOwner } = require("../middleware/auth");

// Create reel
router.post("/uploadReel", auth, uploadReel);

// Get feed (filtered by ?category=Travel or all)
router.post("/feed", getReelsFeed);

// Get single reel details
router.post("/getSingleReel",  getReelById);

// Edit reel (only owner)
router.put("/editReel", auth, isReelOwner(Reel), editReel);

// Delete reel (only owner)
router.delete("/deleteReel", auth, isReelOwner(Reel), deleteReel);

router.get("/getMyreels",auth,getMyReels)

router.post('/reelsBycreator', getReelsByUsername);


module.exports = router;
