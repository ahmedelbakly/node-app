import jwt from 'jsonwebtoken'

// Generate JWT
export const generateToken = (payload, secret, expiresIn = '1h') => {
  return jwt.sign(payload, secret, { expiresIn })
}

// Verify JWT
export const verifyToken = (token, secret) => {
  try {
    return jwt.verify(token, secret)
  } catch (err) {
    throw new Error('Invalid or expired token')
  }
}

// Decode JWT (without verifying)
export const decodeToken = token => {
  return jwt.decode(token)
}

// two factor authentication
export const generate2faCode = async user => {
  const code = Math.floor(100000 + Math.random() * 900000)
  user.twoFactorAuthCode = code
  await user.save()
  return code
}

export const generateActivationCode = length => {
  // const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  const chars = '0123456789'
  let activationCode = ''
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length)
    activationCode += chars[randomIndex]
  }
  return activationCode
}

// check user role
export const checkUserRole = (user, role, id = null) => {
  const userCanAccess = user.role == role || user._id == id
  return userCanAccess
}
export const checkUserCan = (user, id) => {
  const userCanAccess = user.id == id
  return userCanAccess
}

export const getUserPermissions = async (
  userModel,
  roleModel,
  userId,
  item,
  action
) => {
  try {
    // Fetch the user by ID
    const user = await userModel.findOne({ _id: userId })
    if (!user) {
      return { error: 'User not found' }
    }

    // Fetch the role of the user
    const role = await roleModel.findOne({ _id: user.role })
    if (!role) {
      return { error: 'Role not found' }
    }

    // Check if the item and action exist in the role permissions
    if (!role[item] || typeof role[item][action] === 'undefined') {
      return { error: 'Permission not found' }
    }

    // Return the permission value
    return role[item][action] || role.name === 'admin'
  } catch (error) {
    // Handle any unexpected errors
    console.error('Error fetching user permissions:', error)
    return { error: 'Internal server error' }
  }
}

/** test */
