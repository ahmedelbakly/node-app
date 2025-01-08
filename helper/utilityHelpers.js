import crypto from 'crypto';

// Generate Random String
export const generateRandomString = (length = 16) => {
  return crypto.randomBytes(length).toString('hex');
};

// Capitalize String
export const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// Validate Email
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Generate Unique Identifier (UUID-like)
export const generateUUID = () => {
  return crypto.randomUUID();
};
