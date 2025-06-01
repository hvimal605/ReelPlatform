const OTP = require("../models/OTP");
const User = require("../models/User");
const otpGenerrator = require('otp-generator')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//sendOTP
exports.sendOTP = async (req, res) => {

    try {

        const { email } = req.body;


        const checkUserPresent = await User.findOne({ email });



        if (checkUserPresent) {
            return res.status(401).json({
                success: false,
                message: "User already registered",
            })
        }


        var otp = otpGenerrator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        })
        console.log("otp generated", otp);



        const result = await OTP.findOne({ otp: otp });

        while (result) {
            otp = otpGenerrator.generate(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false,
            })
            result = await OTP.findOne({ otp: otp });
        }

        const otpPayload = { email, otp };

        //create an entry for otp
        const otpBody = await OTP.create(otpPayload)
        console.log(otpBody);

        //return response successful
        res.status(200).json({
            success: true,
            message: "OTP Sent Successfully",
            otp,
        })


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        })

    }
};




exports.signup = async (req, res) => {
    try {
        const { name , username, email, password, confirmPassword, otp } = req.body;

        // Validation
        if (!name||!username || !email || !password || !confirmPassword || !otp) {
            return res.status(403).json({
                success: false,
                message: "All fields are required",
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Password and ConfirmPassword do not match",
            });
        }

        // Check if user exists (username OR email)
        const existingUser = await User.findOne({
            $or: [{ username: username.trim() }, { email: email.toLowerCase().trim() }]
        });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Username or Email already registered",
            });
        }

        // Validate OTP - fetch latest OTP for email
        const recentOtp = await OTP.find({ email: email.toLowerCase().trim() })
            .sort({ createdAt: -1 })
            .limit(1);

        if (recentOtp.length === 0) {
            return res.status(400).json({
                success: false,
                message: "OTP not found",
            });
        }

        if (otp !== recentOtp[0].otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP",
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await User.create({
             Name: name.trim(),
            username: username.trim(),
            email: email.toLowerCase().trim(),
            password: hashedPassword,
            profileImage: `https://api.dicebear.com/5.x/initials/svg?seed=${encodeURIComponent(username.trim())}`,
            bio: ''
        });

        return res.status(200).json({
            success: true,
            message: "User registered successfully",
            user,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "User cannot be registered. Please try again.",
        });
    }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(403).json({
        success: false,
        message: "All fields are required, please try again",
      });
    }

    // Find user by email (case-insensitive)
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User is not registered, please signup first",
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Password is incorrect",
      });
    }

    // Generate JWT token
    const payload = {
      email: user.email,
      id: user._id,
      username: user.username
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '2h',
    });

    // Remove password from user object before sending
    const userResponse = user.toObject();
    delete userResponse.password;

    // Send token in cookie and response
    const options = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
      httpOnly: true,
    };

    res.cookie("token", token, options).status(200).json({
      success: true,
      token,
      user: userResponse,
      message: 'Logged in successfully',
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Login failure, please try again',
    });
  }
};


exports.changePassword = async (req, res) => {
    try {
      // Get user data from req.user
      const userDetails = await User.findById(req.user.id)
      
  
      // Get old password, new password, and confirm new password from req.body
      const { oldPassword, newPassword } = req.body
      
  
      // Validate old password
      const isPasswordMatch = await bcrypt.compare(
        oldPassword,
        userDetails.password
      )
      if (!isPasswordMatch) {
        // If old password does not match, return a 401 (Unauthorized) error
        return res
          .status(401)
          .json({ success: false, message: "The password is incorrect" })
      }
  
      // Update password
      const encryptedPassword = await bcrypt.hash(newPassword, 10)
      const updatedUserDetails = await User.findByIdAndUpdate(
        req.user.id,
        { password: encryptedPassword },
        { new: true }
      )
  
      // Send notification email
      try {
        const emailResponse = await mailSender(
          updatedUserDetails.email,
          "Password for your account has been updated",
          passwordUpdated(
            updatedUserDetails.email,
            `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
          )
        )
        console.log("Email sent successfully:", emailResponse.response)
      } catch (error) {
        // If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
        console.error("Error occurred while sending email:", error)
        return res.status(500).json({
          success: false,
          message: "Error occurred while sending email",
          error: error.message,
        })
      }
  
      // Return success response
      return res
        .status(200)
        .json({ success: true, message: "Password updated successfully" })
    } catch (error) {
      // If there's an error updating the password, log the error and return a 500 (Internal Server Error) error
      console.error("Error occurred while updating password:", error)
      return res.status(500).json({
        success: false,
        message: "Error occurred while updating password",
        error: error.message,
      })
    }
  }


exports.checkusername = async (req, res) => {
  try {
    const { username } = req.query;
    console.log("Checking username:", username);

    if (!username || username.trim().length < 3) {
      return res.status(400).json({ success: false, message: 'Username must be at least 3 characters' });
    }

    const existingUser = await User.findOne({ username: username.trim() });

    if (existingUser) {
      return res.status(409).json({ success: false, message: 'Username already taken' });
    }

    return res.status(200).json({ success: true, message: 'Username is available' });
  } catch (error) {
    console.error('Error checking username:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};