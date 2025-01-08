import User from '../model/user-model.js'
import {
  createDocument,
  getDocuments
} from '../helper/crud-helper-functions.js'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
import { comparePassword, hashPassword } from '../helper/hashHelpers.js'
import {
  checkUserRole,
  generate2faCode,
  generateActivationCode,
  generateToken
} from '../helper/authHelpers.js'
import {
  htmlContentForPasswordChangeEmail,
  htmlContentForTwoFactorAuth,
  htmlContentInRePassLineCSS,
  sendActiveEmail
} from '../helper/nodeMailer.js'
dotenv.config()
// register user
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role = 'admin' } = req.body
    // check if all fields are entered
    if (!name || !email || !password) {
      return res.status(400).json({
        message: 'Please enter all fields'
      })
    }
    // check if user already exists
    const user = await User.findOne({
      email
    })
    if (user) {
      return res.status(400).json({
        message: 'User already exists'
      })
    }
    // hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // create new user
    const userCreated = await createDocument(User, {
      name,
      email,
      password: hashedPassword,
      role: role
    })
    return res.status(201).json({
      message: 'User created successfully'
    })
  } catch (error) {
    return res.status(500).json({
      message: error.message
    })
  }
}

// add new user
const addNewUser = async (req, res) => {
  const adminId = req.user.id
  try {
    const { name, email, password, role = 'user' } = req.body
    // check if all fields are entered
    if (!name || !email || !password) {
      return res.status(400).json({
        message: 'Please enter all fields'
      })
    }
    // check if user already exists
    const user = await User.findOne({
      email
    })
    if (user) {
      return res.status(400).json({
        message: 'User already exists'
      })
    }

    const userCan = checkUserRole(req.user, 'admin')
    if (!userCan) {
      return res.status(401).json({
        message: 'You are not authorized to perform this action'
      })
    }
    // hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // create new user
    const userCreated = await createDocument(User, {
      name,
      email,
      password: hashedPassword,
      role: role,
      adminId
    })
    return res.status(201).json({
      message: 'User created successfully'
    })
  } catch (error) {
    return res.status(500).json({
      message: error.message
    })
  }
}

// login user Controller function
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body
    // check if all fields are entered
    if (!email || !password) {
      return res.status(400).json({
        message: 'Please enter all fields'
      })
    }
    // check if user exists
    const user = await User.findOne({
      email
    })
    if (!user) {
      return res.status(400).json({
        message: 'User does not exist'
      })
    }
    // check if password is correct
    const isPasswordCorrect = await comparePassword(password, user.password)
    if (!isPasswordCorrect) {
      return res.status(400).json({
        message: 'Incorrect password'
      })
    }

    // create two factor authentication code
    if (user.twoFactorAuth) {
      const twoFactorAuth = await generate2faCode(user)
      //send verify email to User
      await sendActiveEmail(
        'Activate two factor authentication',
        user.email,
        htmlContentForTwoFactorAuth(twoFactorAuth)
      )
      return res.status(400).json({
        message: 'Two factor authentication is enabled',
        userId: user._id
      })
    }
    const accessToken = generateToken(
      {
        id: user._id,
        role: user.role
      },
      process.env.JWT_ACCESS_SECRET,
      process.env.JWT_ACCESS_EXPIRES_IN
    )
    const refreshToken = generateToken(
      {
        id: user._id
      },
      process.env.JWT_ACCESS_SECRET,
      process.env.JWT_REFRESH_EXPIRES_IN
    )
    return res.status(200).json({
      message: 'Login successful',
      accessToken,
      refreshToken
    })

    // create token
  } catch (error) {
    return res.status(500).json({
      message: error.message
    })
  }
}

// active two factor authentication Controller function
const activeTwoFactor = async (req, res) => {
  const id = req.user.id
  try {
    const user = await User.findById(id)
    if (!user) {
      return res.status(400).json({
        message: 'User does not exist'
      })
    }
    // check if user has two factor authentication enabled
    user.twoFactorAuth = !user.twoFactorAuth
    await user.save()
    return res.status(200).json({
      message: 'Two factor authentication enabled'
    })
  } catch (error) {
    return res.status(500).json({
      message: error.message
    })
  }
}
// check if code in correct Controller function
const checkTwoFactorCode = async (req, res) => {
  const { code, id } = req.body
  // check if all fields are entered
  console.log('====================================')
  console.log(code?.trim()?.length)
  console.log('====================================')
  if (!code || code?.trim()?.length !== 6) {
    return res.status(400).json({
      message: 'please enter code and code should be 6 digits'
    })
  }

  try {
    const user = await User.findById(id)
    if (!user) {
      return res.status(400).json({
        message: 'User does not exist'
      })
    }
    // check if code is correct

    // check if code is correct
    if (user.twoFactorAuthCode !== code?.trim()) {
      return res.status(400).json({
        message: 'Incorrect code'
      })
    }
    // create token
    const accessToken = generateToken(
      { id: user._id, role: user.role },
      process.env.JWT_ACCESS_SECRET,
      process.env.JWT_ACCESS_EXPIRES_IN
    )
    const refreshToken = generateToken(
      { id: user._id },
      process.env.JWT_ACCESS_SECRET,
      process.env.JWT_REFRESH_EXPIRES_IN
    )
    user.twoFactorAuthCode = null
    await user.save()

    return res.status(200).json({
      message: 'Login successful',
      accessToken,
      refreshToken
    })
  } catch (error) {
    return res.status(500).json({
      message: error.message
    })
  }
}

// get all  user functions in one object
const getAllUserController = async (req, res) => {
  try {
    return res.status(200).json({
      message: 'All users',
      users: await getDocuments(
        User,
        {},
        { sort: { createdAt: -1 } },
        '_id name email role'
      )
    })
  } catch (error) {
    return res.status(500).json({
      message: error.message
    })
  }
}

const forgetPassword = async (req, res, next) => {
  const { email } = req.body

  if (!email) {
    return res
      .status(400)
      .json({ message: 'Email is required', success: false })
  }

  try {
    // Find user by email
    const user = await User.findOne({ email })

    if (!user) {
      return res
        .status(404)
        .json({ message: 'Email not registered', success: false })
    }

    // Generate OTP for password reset
    const otp = generateActivationCode(6)

    // Update user document with OTP and expiration time
    user.forgetPasswordCode = otp
    user.passwordResetExpiration = Date.now() + 3600000 // OTP expires in 1 hour
    await user.save()

    // Send password reset email
    await sendActiveEmail(
      'Password Reset OTP',
      user.email,
      htmlContentInRePassLineCSS(otp)
    )

    const accessToken = generateToken(
      { id: user._id, role: user.role },
      process.env.JWT_ACCESS_SECRET,
      process.env.JWT_ACCESS_EXPIRES_IN
    )

    return res.status(200).json({
      email,
      message: 'OTP has been sent to your email',
      success: true,
      accessToken
    })
  } catch (error) {
    console.error('Error during password reset:', error)
    return res
      .status(500)
      .json({ message: 'Internal server error', success: false })
  }
}

const checkOtp = async (req, res, next) => {
  const { otp, email } = req.body

  if (!otp || !email) {
    return res.status(400).json({
      message: 'OTP and email are required',
      success: false
    })
  }

  try {
    const user = await User.findOne({ email })

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
        success: false
      })
    }

    // Check if OTP matches
    if (user.forgetPasswordCode !== otp) {
      return res.status(401).json({
        message: 'Invalid OTP',
        success: false
      })
    }

    // Check if OTP has expired
    if (Date.now() > user.passwordResetExpiration) {
      return res.status(401).json({
        message: 'OTP has expired',
        success: false
      })
    }

    return res.status(200).json({ success: true })
  } catch (error) {
    console.error('Error during OTP verification:', error)
    return res
      .status(500)
      .json({ message: 'Internal server error', success: false })
  }
}

const resetPassword = async (req, res, next) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({
      message: 'Email and password are required',
      success: false
    })
  }

  try {
    const user = await User.findOne({ email })

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
        success: false
      })
    }

    // Check if OTP matches and is not expired
    if (Date.now() > user.passwordResetExpiration) {
      return res.status(401).json({
        message: 'OTP has expired',
        success: false
      })
    }

    // Hash the new password and update the user's password
    user.password = await hashPassword(password)
    user.passwordResetExpiration = null
    user.forgetPasswordCode = null // Clear OTP after successful reset
    user.passwordChangeAt = Date.now()
    await user.save()

    // Send confirmation email for password reset success
    await sendActiveEmail(
      'Password Reset Successful',
      user.email,
      htmlContentForPasswordChangeEmail()
    )

    return res.status(200).json({
      success: true,
      message: 'Password has been successfully reset'
    })
  } catch (error) {
    console.error('Error during password reset:', error)
    return res
      .status(500)
      .json({ message: 'Internal server error', success: false })
  }
}

// get all user by admin id controller functions
const getAllUserByAdminId = async (req, res) => {
  try {
    const { id: adminId, role } = req.user
    const userCan = checkUserRole(req.user, 'admin')
    if (!userCan) {
      return res
        .status(403)
        .json({ message: 'You do not have permission to perform this action' })
    }
    const users = await getDocuments(
      User,
      { role: 'user' },
      { sort: { createdAt: -1 } },
      '_id name email role'
    )

    return res.status(200).json({
      message: 'All users',
      users
    })
  } catch (error) {
    return res.status(500).json({
      message: 'Internal server error',
      success: false
    })
  }
}

//

export {
  registerUser,
  loginUser,
  activeTwoFactor,
  checkTwoFactorCode,
  getAllUserController,
  forgetPassword,
  checkOtp,
  resetPassword,
  addNewUser,
  getAllUserByAdminId
}

/*
const accessToken = generateToken(
      { id: user._id, role: user.role },
      process.env.JWT_ACCESS_SECRET,
      process.env.JWT_ACCESS_EXPIRES_IN
    );
    const refreshToken = generateToken(
      { id: user._id },
      process.env.JWT_ACCESS_SECRET,
      process.env.JWT_REFRESH_EXPIRES_IN
    );
    return res.status(200).json({
      message: "Login successful",
      accessToken,
      refreshToken,
    });




*/
