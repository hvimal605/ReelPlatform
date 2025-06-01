
const Reel = require('../models/Reel');

exports.likeReel = async (req, res) => {
  try {
    const { reelId } = req.body;
    console.log("Reel ID to like:", reelId);
    const userId = req.user.id;

    const reel = await Reel.findById(reelId);
    if (!reel) return res.status(404).json({ success: false, message: 'Reel not found' });

    if (!reel.likes.includes(userId)) {
      reel.likes.push(userId);
      reel.dislikes.pull(userId); // Remove from dislikes if present
    } else {
      reel.likes.pull(userId); // Toggle like
    }

    await reel.save();

    res.status(200).json({
      success: true,
      message: 'Reel like toggled',
      totalLikes: reel.likes.length,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error liking reel' });
  }
};


exports.dislikeReel = async (req, res) => {
  try {
    const { reelId } = req.body;
    const userId = req.user.id;

    const reel = await Reel.findById(reelId);
    if (!reel) return res.status(404).json({ success: false, message: 'Reel not found' });

    if (!reel.dislikes.includes(userId)) {
      reel.dislikes.push(userId);
      reel.likes.pull(userId); // Remove from likes if present
    } else {
      reel.dislikes.pull(userId); // Toggle dislike
    }

    await reel.save();

    res.status(200).json({
      success: true,
      message: 'Reel dislike toggled',
      totalDislikes: reel.dislikes.length,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error disliking reel' });
  }
};



exports.shareReel = async (req, res) => {
  try {
    const { reelId } = req.body;

    if (!reelId) {
      return res.status(400).json({ message: 'Reel ID is required' });
    }

    const reel = await Reel.findById(reelId);

    if (!reel) {
      return res.status(404).json({ message: 'Reel not found' });
    }

    reel.shareCount += 1;
    await reel.save();

    res.status(200).json({ message: 'Reel shared successfully', shareCount: reel.shareCount });
  } catch (error) {
    console.error('Error sharing reel:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


exports.getEngagement = async (req, res) => {
  try {
    const { reelId } = req.body;

    const reel = await Reel.findById(reelId);

    if (!reel) {
      return res.status(404).json({ success: false, message: 'Reel not found' });
    }

    const likeCount = reel.likes.length;
    const dislikeCount = reel.dislikes.length;
    const shareCount = reel.shareCount;

    return res.status(200).json({
      success: true,
      data: {
        likeCount,
        dislikeCount,
        shareCount,
      },
    });
  } catch (error) {
    console.error('Error fetching engagement data:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
