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
import httpStatus from 'http-status'
import { errorResponse, successResponse } from '../helper/responseHelpers.js'

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body
    // check if all fields are entered
    if (!name || !email || !password) {
      return errorResponse(
        res,
        'Please enter all fields',
        httpStatus.BAD_REQUEST
      )
    }
    // check if user already exists
    const user = await User.findOne({
      email
    })
    if (user) {
      return errorResponse(res, 'User already exists', httpStatus.BAD_REQUEST)
    }
    // hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // create new user
    const userCreated = await createDocument(User, {
      name,
      email,
      password: hashedPassword,
      role: '678230c8deb777a32dd3e32c'
    })

    return successResponse(
      res,
      'User created successfully',
      userCreated,
      httpStatus.CREATED
    )
  } catch (error) {
    return errorResponse(res, error.message, httpStatus.INTERNAL_SERVER_ERROR)
  }
}

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body
    // check if all fields are entered
    if (!email || !password) {
      return errorResponse(
        res,
        'Please enter all fields',
        httpStatus.BAD_REQUEST
      )
    }
    // check if user exists
    const user = await User.findOne({
      email
    }).populate('role')

    if (!user) {
      return errorResponse(res, 'User does not exist', httpStatus.BAD_REQUEST)
    }
    // check if password is correct
    const isPasswordCorrect = await comparePassword(password, user.password)
    if (!isPasswordCorrect) {
      return errorResponse(res, 'Invalid credentials', httpStatus.BAD_REQUEST)
    }

    // create two factor authentication code
    // if (user.twoFactorAuth) {
    //   const twoFactorAuth = await generate2faCode(user);
    //   //send verify email to User
    //   await sendActiveEmail(
    //     "Activate two factor authentication",
    //     user.email,
    //     htmlContentForTwoFactorAuth(twoFactorAuth)
    //   );
    //   return successResponse(
    //     res,
    //     "Two factor authentication is enabled",
    //     user,
    //     httpStatus.OK
    //   );
    // }
    const accessToken = generateToken(
      {
        id: user._id,
        role: user.role?.name
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
    return successResponse(
      res,
      'Login successful',
      { user, accessToken, refreshToken },
      httpStatus.OK
    )

    // create token
  } catch (error) {
    return errorResponse(res, error.message, httpStatus.INTERNAL_SERVER_ERROR)
  }
}

// active two factor authentication Controller function
const activeTwoFactor = async (req, res) => {
  const id = req.user.id
  try {
    const user = await User.findById(id)
    if (!user) {
      errorResponse(res, 'User does not exist', httpStatus.BAD_REQUEST)
    }
    // check if user has two factor authentication enabled
    user.twoFactorAuth = !user.twoFactorAuth
    await user.save()

    successResponse(
      res,
      'Two factor authentication is enabled',
      user,
      httpStatus.OK
    )
  } catch (error) {
    errorResponse(res, error.message, httpStatus.INTERNAL_SERVER_ERROR)
  }
}
// check if code in correct Controller function
const checkTwoFactorCode = async (req, res) => {
  const { code, id } = req.body
  // check if all fields are entered

  if (!code || code?.trim()?.length !== 6) {
    errorResponse(res, 'Please enter a valid code', httpStatus.BAD_REQUEST)
  }

  try {
    const user = await User.findById(id)
    if (!user) {
      errorResponse(res, 'User does not exist', httpStatus.BAD_REQUEST)
    }
    // check if code is correct

    // check if code is correct
    if (user.twoFactorAuthCode !== code?.trim()) {
      errorResponse(res, 'Invalid code', httpStatus.BAD_REQUEST)
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

    successResponse(
      res,
      'Login successful',
      { accessToken, refreshToken },
      httpStatus.OK
    )
  } catch (error) {
    errorResponse(res, error.message, httpStatus.INTERNAL_SERVER_ERROR)
  }
}

export { registerUser, loginUser, activeTwoFactor, checkTwoFactorCode }
