import express from 'express';
import { hashPassword, comparePassword } from '../helpers/hashHelpers.js';
import { generateToken } from '../helpers/authHelpers.js';
import { successResponse, errorResponse } from '../helpers/responseHelpers.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await hashPassword(password);

    // Save to database (not implemented here)
    const user = { email, password: hashedPassword };

    successResponse(res, 'User registered successfully', user);
  } catch (err) {
    errorResponse(res, err.message);
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Fetch user from database (mocked here)
    const user = { email, password: '$2b$10$...' }; // Replace with the real hashed password

    if (!user || !(await comparePassword(password, user.password))) {
      return errorResponse(res, 'Invalid credentials', 401);
    }

    const token = generateToken({ email: user.email }, process.env.JWT_SECRET);
    successResponse(res, 'Login successful', { token });
  } catch (err) {
    errorResponse(res, err.message);
  }
});

export default router;
