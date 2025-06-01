const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require("../models/User");

dotenv.config();

exports.auth = async (req, res, next) => {
  try {
    const token =
      req.cookies?.token ||
      req.body?.token ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ success: false, message: "Token missing" });
    }


    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // Contains user._id, email, role, etc.
    } catch (err) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    next();
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Error validating token",
    });
  }
};

exports.isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user.role !== "Admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admins only.",
      });
    }

    next();
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error checking admin role",
    });
  }
};

exports.isReelOwner = (Model) => {
  return async (req, res, next) => {
    try {
      const { reelId } = req.body;
      const doc = await Model.findById(reelId);

      if (!doc) {
        return res.status(404).json({ success: false, message: "Item not found" });
      }

      if (doc.user.toString() !== req.user.id) {
        return res.status(403).json({ success: false, message: "Access denied. Not owner." });
      }

      next();
    } catch (err) {
      return res.status(500).json({ success: false, message: "Error checking ownership" });
    }
  };
};
