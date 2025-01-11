import User from '../model/user-model.js'
import {
  createDocument,
  deleteDocumentById,
  getDocumentById,
  getDocuments,
  updateDocumentById
} from '../helper/crud-helper-functions.js'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'

import { checkUserRole, getUserPermissions } from '../helper/authHelpers.js'
import { errorResponse, successResponse } from '../helper/responseHelpers.js'
import httpStatus from 'http-status'
import { comparePassword, hashPassword } from '../helper/hashHelpers.js'

// register user

// add new user
const addNewUser = async (req, res) => {
  const { id, role: userRole } = req.user // Destructure the user role and id from the request user

  try {
    // Destructure the necessary fields from the request body
    const { name, email, password, role } = req.body

    // Check if all required fields are provided
    if (!name || !email || !password || !role) {
      return errorResponse(
        res,
        'Please enter all fields',
        httpStatus.BAD_REQUEST
      )
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return errorResponse(res, 'User already exists', httpStatus.BAD_REQUEST)
    }

    // Determine the adminId (only set it if the current user is an admin)
    const adminId =
      userRole === 'admin' ? id : (await User.findById(id))?.adminId

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create the new user in the database
    const newUser = await createDocument(User, {
      name,
      email,
      password: hashedPassword,
      role,
      adminId,
      type: 'user'
    })

    // Send a success response
    return successResponse(res, 'User created successfully', httpStatus.CREATED)
  } catch (error) {
    // Log the error and send a server error response
    console.error('Error creating user:', error)
    return errorResponse(
      res,
      'Something went wrong, please try again later',
      httpStatus.INTERNAL_SERVER_ERROR
    )
  }
}

// login user Controller function

// get all  user functions in one object
const getAllUserController = async (req, res) => {
  const { id, role } = req.user // Destructure the user role and id from the request user
  const adminId = role === 'admin' ? id : (await User.findById(id))?.adminId

  console.log({ adminId })

  const users = await getDocuments(
    User, // The model to query
    { adminId: adminId, type: 'user' }, // The query condition (adminId and type filter)
    { sort: { createdAt: -1 } }, // Options, such as sorting
    '_id name email role adminId',
    'role' // Fields to select
    // No population needed here
  )

  try {
    return successResponse(res, 'All users', users, httpStatus.OK)
  } catch (error) {
    return errorResponse(res, error.message, httpStatus.INTERNAL_SERVER_ERROR)
  }
}

// get all user by admin id controller functions
const getAllUserByAdminId = async (req, res) => {
  try {
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

const userOnAuth = async (req, res) => {
  try {
    const user = await getDocumentById(
      User,
      { _id: req.user.id },
      '_id name email role',
      'role'
    )
    return successResponse(res, 'User', user)
  } catch (error) {
    return successResponse(res, error.message, httpStatus.INTERNAL_SERVER_ERROR)
  }
}
// get user by id
const getUserById = async (req, res) => {
  try {
    const user = await getDocumentById(
      User,
      { _id: req.params.id },
      '_id name email role adminId',
      'role'
    )
    return successResponse(res, 'User', user, httpStatus.OK)
  } catch (error) {
    return successResponse(res, error.message, httpStatus.INTERNAL_SERVER_ERROR)
  }
}
// update user
const updateUser = async (req, res) => {
  try {
    const { name, email, role, password } = req.body

    const UserPassword = await getDocumentById(
      User,
      { _id: req.params.id },
      'password'
    )

    if (password && !(await comparePassword(password, UserPassword.password))) {
      const hashedPassword = await hashPassword(password)
      const user = await updateDocumentById(
        User,
        { _id: req.params.id },
        {
          name,
          email,
          role,
          password: hashedPassword
        }
      )
    }
    const user = await updateDocumentById(
      User,
      { _id: req.params.id },
      {
        name,
        email,
        role
      }
    )
    return successResponse(res, 'User', user, httpStatus.OK)
  } catch (error) {
    return successResponse(res, error.message, httpStatus.INTERNAL_SERVER_ERROR)
  }
}

// delete user
const deleteUser = async (req, res) => {
  try {
    const user = await deleteDocumentById(User, req.params.id)
    return successResponse(res, 'User', user, httpStatus.OK)
  } catch (error) {
    return successResponse(res, error.message, httpStatus.INTERNAL_SERVER_ERROR)
  }
}

//

export {
  getAllUserController,
  addNewUser,
  getAllUserByAdminId,
  userOnAuth,
  getUserById,
  updateUser,
  deleteUser
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
