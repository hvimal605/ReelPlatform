const express = require("express");
const router = express.Router();

const {
  addComment,
  deleteComment,
  
  getCommentsByReel,
  editComment,
  getReelComments,
} = require("../controller/comment");
const { auth } = require("../middleware/auth");

// Add comment to a reel
router.post("/addComment", auth, addComment);

// Edit comment (only owner)
router.put("/editComment/:commentId", auth, editComment);

// Delete comment (by owner or admin)
router.delete("/deleteComment/:commentId", auth, deleteComment);

// Get all comments for a reel
router.post("/getallComment",  getReelComments);

module.exports = router;
