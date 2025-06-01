

const User = require('../models/User');
const Reel = require('../models/Reel');
const { default: mongoose } = require('mongoose');
const { uploadImageToCloudinary } = require('../utils/imageUploader');


exports.getUserProfile = async (req, res) => {
  try {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ success: false, message: "Username is required" });
    }

    // Find user by username
    const user = await User.findOne({ username }).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Find reels by user ID
    const reels = await Reel.find({ user: user._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      user,
      reels,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


exports.updateProfile = async (req, res) => {
  try {
    const {
      Name = "",
      username = "",
      bio = "",

    } = req.body
    const id = req.user.id

    // Find the profile by id
    const userDetails = await User.findById(id)
  

    const user = await User.findByIdAndUpdate(id, {
      Name,
      username,
      bio
    })
    await user.save()

  


    // Find the updated user details
    const updatedUserDetails = await User.findById(id)
     

    return res.json({
      success: true,
      message: "Profile updated successfully",
      updatedUserDetails,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      error: error.message,
    })
  }
}

exports.updateDisplayPicture = async (req, res) => {
  try {
    const displayPicture = req.files.displayPicture;
    
    
    const userId = req.user.id
    const image = await uploadImageToCloudinary(
      displayPicture,
      process.env.FOLDER_NAME,
      1000,
      1000
    )
    console.log(image)
    const updatedProfile = await User.findByIdAndUpdate(
      { _id: userId },
      { profileImage: image.secure_url },
      { new: true }
    )
    res.send({
      success: true,
      message: `Image Updated successfully`,
      data: updatedProfile,
    })
  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}





exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    if (req.user._id.toString() !== userId) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    // Delete user reels as well
    await Reel.deleteMany({ user: userId });
    await User.findByIdAndDelete(userId);

    res.status(200).json({ success: true, message: 'User and reels deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};


exports.getUserReels = async (req, res) => {
  try {
    const userId = req.params.id;

    const reels = await Reel.find({ user: userId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      reels,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
