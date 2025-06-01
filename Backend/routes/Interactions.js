const express = require("express");
const router = express.Router();

const {
  likeReel,
  dislikeReel,
  shareReel,
  getEngagement,
} = require("../controller/Interaction");
const { auth } = require("../middleware/auth");

// Like a reel
router.post("/like", auth, likeReel);

// Dislike a reel
router.post("/dislike", auth, dislikeReel);

// Share a reel
router.post("/share",  shareReel);


router.post("/getEnagement",getEngagement)

module.exports = router;
