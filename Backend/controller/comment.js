const Comment = require('../models/comment');
const Reel = require('../models/Reel');

exports.addComment = async (req, res) => {
  try {
    const { reelId } = req.body;
    const { text } = req.body;
    const userId = req.user.id;

    if (!text) return res.status(400).json({ success: false, message: 'Comment text is required' });

    let comment = await Comment.create({ user: userId, reel: reelId, text });
    comment = await comment.populate('user', 'username profileImage'); 
    const reel = await Reel.findById(reelId);
    reel.comments.push(comment._id);
    await reel.save();

    res.status(201).json({
      success: true,
      message: 'Comment added',
      comment,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: 'Failed to add comment' });
  }
};


exports.deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ success: false, message: 'Comment not found' });

    if (comment.user.toString() !== userId.toString() && userRole !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    await Comment.findByIdAndDelete(commentId);
    await Reel.findByIdAndUpdate(comment.reel, { $pull: { comments: comment._id } });

    res.status(200).json({ success: true, message: 'Comment deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete comment' });
  }
};


exports.getReelComments = async (req, res) => {
  try {
    const { reelId } = req.body;

    const comments = await Comment.find({ reel: reelId })
      .populate('user', 'username profileImage')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, comments });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching comments' });
  }
};

exports.editComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { text } = req.body;
    const userId = req.user.id;

    if (!text) {
      return res.status(400).json({ success: false, message: 'Comment text is required' });
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }

    // Only comment owner can edit
    if (comment.user.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized to edit this comment' });
    }

    comment.text = text;
    await comment.save();

    res.status(200).json({
      success: true,
      message: 'Comment updated successfully',
      comment,
    });
  } catch (err) { 
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to update comment' });
  }
};
