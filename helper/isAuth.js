import { verifyToken } from "./authHelpers.js";
import dotenv from "dotenv";
dotenv.config();

export const isAuth = (req, res, next) => {
  // Extract the token from the Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1]; // Get the token from "Bearer <token>"

  console.log('====================================');
  console.log({token});
  console.log('====================================');

  try {
    // Verify the token
    const decoded = verifyToken(token, process.env.JWT_ACCESS_SECRET);
    req.user = decoded; // Attach the decoded user data to the request object
    next(); // Proceed to the next middleware/route handler
  } catch (err) {
    return res
      .status(403)
      .json({ success: false, message: "Forbidden: Invalid or expired token" });
  }
};
