const Reel = require('../models/Reel');
const User = require('../models/User');
const { uploadImageToCloudinary } = require('../utils/imageUploader');



exports.uploadReel = async (req, res) => {
  try {
    const { category, caption} = req.body; // caption & description added
    const userId = req.user.id; 

    const video = req.files?.video;

    if (!video || !category) {
      return res.status(400).json({
        success: false,
        message: 'Video file and category are required',
      });
    }

    // Upload video to Cloudinary
    const videoUploadResponse = await uploadImageToCloudinary(video, process.env.FOLDER_NAME);

    // Create reel with video URL and new fields
    const reel = await Reel.create({
      user: userId,
      videoUrl: videoUploadResponse.secure_url, 
      category,
      caption: caption || '',       // optional, default empty string
      
    });

    res.status(201).json({
      success: true,
      message: 'Reel uploaded successfully',
      reel,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error while uploading reel',
    });
  }
};


exports.getReelsFeed = async (req, res) => {
  try {
    const { category } = req.body;

    // Fix: only filter if category is defined and not 'All'
    const filter = category && category !== 'All' ? { category } : {};

    const reels = await Reel.find(filter)
      .populate('user', 'username profileImage')
      .populate({
        path: 'comments',
        populate: { path: 'user', select: 'username profileImage' },
      })
      .sort({ createdAt: -1 }); // latest first

    res.status(200).json({
      success: true,
      message: "Reels fetched successfully",
      reels,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to fetch reels' });
  }
};


exports.getReelById = async (req, res) => {
  try {
    const { reelId } = req.body;
    console.log("Reel ID:", reelId);
    const reel = await Reel.findById(reelId)
      .populate('user', 'username profileImage')
      .populate({
        path: 'comments',
        populate: { path: 'user', select: 'username profileImage' },
      });

    if (!reel) {
      return res.status(404).json({ success: false, message: 'Reel not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Reel details fetched successfully',
      reel,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to get reel details' });
  }
};

exports.editReel = async (req, res) => {
  try {
    const { reelId } = req.body;
    const userId = req.user.id;
    const { category, caption } = req.body;

    const reel = await Reel.findById(reelId);

    if (!reel) {
      return res.status(404).json({ success: false, message: 'Reel not found' });
    }

    if (reel.user.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: 'You are not authorized to edit this reel' });
    }

    // Update fields only if provided
    if (category) reel.category = category;
    if (caption !== undefined) reel.caption = caption;
  

    await reel.save();

    res.status(200).json({
      success: true,
      message: 'Reel updated successfully',
      reel,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to update reel' });
  }
};



exports.deleteReel = async (req, res) => {
  try {
    const { reelId } = req.body;
    // console.log("Reel ID to delete:", reelId);
    const userId = req.user.id;

    const reel = await Reel.findById(reelId);

    if (!reel) {
      return res.status(404).json({ success: false, message: 'Reel not found' });
    }

    if (reel.user.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: 'You are not authorized to delete this reel' });
    }

    await Reel.findByIdAndDelete(reelId);

    res.status(200).json({
      success: true,
      message: 'Reel deleted successfully',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to delete reel' });
  }
};



exports.getMyReels = async (req, res) => {
  try {
    const userId = req.user.id;

    const reels = await Reel.find({ user: userId })
      .populate('user', 'username profileImage')
      .populate({
        path: 'comments',
        populate: { path: 'user', select: 'username profileImage' },
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Your uploaded reels fetched successfully',
      reels,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to fetch your reels' });
  }
};



exports.getReelsByUsername = async (req, res) => {
  try {
    const { username } = req.body;

    // 1. Find the user by username
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // 2. Find reels by user ID
    const reels = await Reel.find({ user: user._id })
      .populate('user', 'username profileImage')
      .populate({
        path: 'comments',
        populate: { path: 'user', select: 'username profileImage' },
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: `Reels by ${username} fetched successfully`,
      reels,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reels by username',
    });
  }
};
