import express from 'express'

import {
  registerUser,
  loginUser,
  activeTwoFactor,
  checkTwoFactorCode,
  getAllUserController,
  forgetPassword,
  resetPassword,
  checkOtp,
  addNewUser,
  getAllUserByAdminId
} from '../controller/user-controller.js'
import { isAuth } from '../helper/isAuth.js'

const userRouter = express.Router()

// router for user registration
// user/register
userRouter.post('/register', registerUser)

// router for user login
// user/login
userRouter.post('/login', loginUser)

// router for user active two factor authentication
// user/active-two-factor
userRouter.patch('/active-two-factor', isAuth, activeTwoFactor)

// router for user check two factor authentication code
// user/check-two-factor
userRouter.post('/check-two-factor', checkTwoFactorCode)

//  getAllUserController
// user/get-all
userRouter.get('/get-all', getAllUserController)

//  forgetPassword
userRouter.post('/auth/forgetPassword', forgetPassword)
userRouter.post('/verificationCode', isAuth, checkOtp)
userRouter.post('/resetPassword', isAuth, resetPassword)
userRouter.post('/add-new-user', isAuth, addNewUser)
userRouter.get('/get-all-user-by-admin-id', isAuth, getAllUserByAdminId)

export default userRouter
