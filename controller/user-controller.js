import User from "../model/user-model.js";
import {
  createDocument,
  getDocuments,
} from "../helper/crud-helper-functions.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

import { checkUserRole } from "../helper/authHelpers.js";
import { successResponse } from "../helper/responseHelpers.js";

dotenv.config();
// register user

// add new user
const addNewUser = async (req, res) => {
  const adminId = req.user.id;
  try {
    const { name, email, password, role = "user" } = req.body;
    // check if all fields are entered
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Please enter all fields",
      });
    }
    // check if user already exists
    const user = await User.findOne({
      email,
    });
    if (user) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const userCan = checkUserRole(req.user, "admin");
    if (!userCan) {
      return res.status(401).json({
        message: "You are not authorized to perform this action",
      });
    }
    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create new user
    const userCreated = await createDocument(User, {
      name,
      email,
      password: hashedPassword,
      role: role,
      adminId,
    });
    return res.status(201).json({
      message: "User created successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// login user Controller function

// get all  user functions in one object
const getAllUserController = async (req, res) => {
  const userCan = checkUserRole(req.user, "admin");
  if (!userCan) {
    return res
      .status(403)
      .json({ message: "You do not have permission to perform this action" });
  }
  try {
    return res.status(200).json({
      message: "All users",
      users: await getDocuments(
        User,
        {},
        { sort: { createdAt: -1 } },
        "_id name email role"
      ),
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// get all user by admin id controller functions
const getAllUserByAdminId = async (req, res) => {
  try {
    const userCan = checkUserRole(req.user, "admin");
    if (!userCan) {
      return res
        .status(403)
        .json({ message: "You do not have permission to perform this action" });
    }
    const users = await getDocuments(
      User,
      { role: "user" },
      { sort: { createdAt: -1 } },
      "_id name email role"
    );

    return res.status(200).json({
      message: "All users",
      users,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

const userOnAuth = async (req, res) => {
  try {
    const user = await getDocuments(
      User,
      { _id: req.user.id },
      {},
      "_id name email role"
    );
    return successResponse(res, "User", user);
  } catch (error) {
    return successResponse(
      res,
      error.message,
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

//

export { getAllUserController, addNewUser, getAllUserByAdminId, userOnAuth };

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
