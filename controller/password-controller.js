import User from "../model/user-model.js";
import dotenv from "dotenv";
import { comparePassword, hashPassword } from "../helper/hashHelpers.js";
import {
  generateActivationCode,
  generateToken,
} from "../helper/authHelpers.js";
import {
  htmlContentForPasswordChangeEmail,
  htmlContentInRePassLineCSS,
  sendActiveEmail,
} from "../helper/nodeMailer.js";
dotenv.config();
import httpStatus from "http-status";

const forgetPassword = async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return res
      .status(400)
      .json({ message: "Email is required", success: false });
  }

  try {
    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ message: "Email not registered", success: false });
    }

    // Generate OTP for password reset
    const otp = generateActivationCode(6);

    // Update user document with OTP and expiration time
    user.forgetPasswordCode = otp;
    user.passwordResetExpiration = Date.now() + 3600000; // OTP expires in 1 hour
    await user.save();

    // Send password reset email
    await sendActiveEmail(
      "Password Reset OTP",
      user.email,
      htmlContentInRePassLineCSS(otp)
    );

    const accessToken = generateToken(
      { id: user._id, role: user.role },
      process.env.JWT_ACCESS_SECRET,
      process.env.JWT_ACCESS_EXPIRES_IN
    );

    return res.status(200).json({
      email,
      message: "OTP has been sent to your email",
      success: true,
      accessToken,
    });
  } catch (error) {
    console.error("Error during password reset:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

const checkOtp = async (req, res, next) => {
  const { otp, email } = req.body;

  if (!otp || !email) {
    return res.status(400).json({
      message: "OTP and email are required",
      success: false,
    });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    // Check if OTP matches
    if (user.forgetPasswordCode !== otp) {
      return res.status(401).json({
        message: "Invalid OTP",
        success: false,
      });
    }

    // Check if OTP has expired
    if (Date.now() > user.passwordResetExpiration) {
      return res.status(401).json({
        message: "OTP has expired",
        success: false,
      });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error during OTP verification:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

const resetPassword = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required",
      success: false,
    });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    // Check if OTP matches and is not expired
    if (Date.now() > user.passwordResetExpiration) {
      return res.status(401).json({
        message: "OTP has expired",
        success: false,
      });
    }

    // Hash the new password and update the user's password
    user.password = await hashPassword(password);
    user.passwordResetExpiration = null;
    user.forgetPasswordCode = null; // Clear OTP after successful reset
    user.passwordChangeAt = Date.now();
    await user.save();

    // Send confirmation email for password reset success
    await sendActiveEmail(
      "Password Reset Successful",
      user.email,
      htmlContentForPasswordChangeEmail()
    );

    return res.status(200).json({
      success: true,
      message: "Password has been successfully reset",
    });
  } catch (error) {
    console.error("Error during password reset:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};
const updatePasswordCon = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const id = req.user.id;
    // check if all fields are entered
    if (!oldPassword || !newPassword) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ message: "Please enter old and new password", success: false });
    }

    // Find user by ID
    const user = await User.findById(id);

    if (!user) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ message: "User not found", success: false });
    }

    // Check if the current password matches
    const isPasswordCorrect = await comparePassword(oldPassword, user.password);
    if (!isPasswordCorrect) {
      return res
        .status(httpStatus.UNAUTHORIZED)
        .json({ message: "Old Password is incorrect", success: false });
    }

    // Hash the new password and update user document
    user.password = await hashPassword(newPassword);
    user.passwordChangeAt = Date.now();
    await user.save();

    // Send email to inform user
    await sendActiveEmail(
      "Changed Password",
      user.email,
      htmlContentForPasswordChangeEmail()
    );

    return res
      .status(httpStatus.OK)
      .json({ message: "Password changed successfully", success: true });
  } catch (error) {
    console.error("Error updating password:", error);

    // Handle errors
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: "An error occurred while updating the password",
      success: false,
    });
  }
};

export { forgetPassword, resetPassword, checkOtp, updatePasswordCon };
