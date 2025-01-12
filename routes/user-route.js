import express from 'express'

import {
  getAllUserController,
  addNewUser,
  getAllUserByAdminId,
  userOnAuth,
  getUserById,
  updateUser,
  deleteUser
} from '../controller/user-controller.js'
import { isAuth } from '../helper/isAuth.js'

const userRouter = express.Router()

// Route to fetch all users
// Endpoint: GET /user/get-all
// Description: Retrieves a list of all users in the system
userRouter.get('/get-all',isAuth, getAllUserController)

// Route to add a new user
// Endpoint: POST /user/add-new-user
// Description: Allows authenticated users to add a new user
// Middleware: isAuth
userRouter.post('/add-new-user', isAuth, addNewUser)

// Route to fetch all users associated with a specific admin
// Endpoint: GET /user/get-all-user-by-admin-id
// Description: Retrieves all users that belong to a specific admin (requires authentication)
// Middleware: isAuth
userRouter.get('/get-all-user-by-admin-id', isAuth, getAllUserByAdminId)

userRouter.get('/userOnAuth', isAuth, userOnAuth)
userRouter.get('/getUserById/:id', isAuth, getUserById)
userRouter.put('/updateUser/:id', isAuth, updateUser)
userRouter.delete('/delete/:id', isAuth, deleteUser)


export default userRouter
