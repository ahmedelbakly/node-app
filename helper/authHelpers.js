import jwt from "jsonwebtoken";

// Generate JWT
export const generateToken = (payload, secret, expiresIn = "1h") => {
  return jwt.sign(payload, secret, { expiresIn });
};

// Verify JWT
export const verifyToken = (token, secret) => {
  try {
    return jwt.verify(token, secret);
  } catch (err) {
    throw new Error("Invalid or expired token");
  }
};

// Decode JWT (without verifying)
export const decodeToken = (token) => {
  return jwt.decode(token);
};

// two factor authentication
export const generate2faCode = async (user) => {
  const code = Math.floor(100000 + Math.random() * 900000);
  user.twoFactorAuthCode = code;
  await user.save();
  return code;
};
