import express from "express";
import {
  registerUser,
  loginUser,
  activeTwoFactor,
  checkTwoFactorCode,
} from "../controller/auth-controller.js";
import { forgetPassword, resetPassword, checkOtp, updatePasswordCon } from "../controller/password-controller.js";
import { isAuth } from "../helper/isAuth.js";

const authRouter = express.Router();

// Route for user registration
// Endpoint: POST /user/register
// Description: Registers a new user with the provided details
authRouter.post("/register", registerUser);

// Route for user login
// Endpoint: POST /user/login
// Description: Authenticates a user and provides access token
authRouter.post("/login", loginUser);

// Route to enable two-factor authentication for a user
// Endpoint: PATCH /user/active-two-factor
// Description: Activates two-factor authentication for a user (requires authentication)
// Middleware: isAuth
authRouter.patch("/active-two-factor", isAuth, activeTwoFactor);

// Route to verify two-factor authentication code
// Endpoint: POST /user/check-two-factor
// Description: Checks the validity of the two-factor authentication code
authRouter.post("/check-two-factor", checkTwoFactorCode);

// Route for password recovery initiation
// Endpoint: POST /user/auth/forgetPassword
// Description: Sends a password reset email or OTP for password recovery
authRouter.post("/auth/forgetPassword", forgetPassword);

// Route to verify OTP sent for password recovery
// Endpoint: POST /user/verificationCode
// Description: Verifies the OTP for password recovery (requires authentication)
// Middleware: isAuth
authRouter.post("/verificationCode", isAuth, checkOtp);

// Route to reset the user's password
// Endpoint: POST /user/resetPassword
// Description: Resets the user's password using the provided OTP and new password (requires authentication)
// Middleware: isAuth
authRouter.post("/resetPassword", isAuth, resetPassword);

// Route to update the password of a user
// Endpoint: PUT /user/updatePasswordCon
// Description: Allows an authenticated user to update their password by providing the old and new passwords
// Middleware: isAuth
authRouter.put("/updatePasswordCon", isAuth, updatePasswordCon);

export default authRouter;
