import Role from '../model/role-model.js'
import {
  createDocument,
  getDocuments,
  getDocumentById,
  updateDocumentById,
  deleteDocumentById
} from '../helper/crud-helper-functions.js'
import { successResponse, errorResponse } from '../helper/responseHelpers.js'
import httpStatus from 'http-status'
import User from '../model/user-model.js'

// Create a new role
export const createRole = async (req, res) => {
  const { id: userId, role: userRole } = req.user

  try {
    // Check if the role already exists
    const existingRole = await Role.findOne({ name: req.body.name })
    if (existingRole) {
      return errorResponse(
        res,
        'This role is already in use. Please use a different role name.'
      )
    }

    // Determine the creator based on the user's role
    const createdBy =
      userRole === 'admin' ? userId : (await User.findById(userId))?.adminId

    // Create a new role
    const role = await createDocument(Role, {
      ...req.body,
      createdBy
    })

    return successResponse(res, 'Role created successfully', role)
  } catch (error) {
    return errorResponse(res, error.message)
  }
}

// Get all roles
export const getAllRoles = async (req, res) => {
  const { id: userId, role } = req.user
  const adminId = role === 'admin' ? userId : (await User.findById(userId))?.adminId
  try {
    const roles = await getDocuments(Role, {$or: [{name :"admin"}, { createdBy: adminId }] }, {}, '_id name ')
    return successResponse(res, 'Roles retrieved successfully', roles)
  } catch (error) {
    return errorResponse(res, error.message)
  }
}

// Get a role by ID
export const getRoleById = async (req, res) => {
  try {
    const role = await getDocumentById(
      Role,
      req.params.id,
      req.query.select || null
    )
    if (!role) {
      return errorResponse(res, 'Role not found', httpStatus.NOT_FOUND)
    }
    return successResponse(res, 'Role retrieved successfully', role)
  } catch (error) {
    return errorResponse(res, error.message)
  }
}

// Update a role by ID
export const updateRole = async (req, res) => {
  try {
    const updatedRole = await updateDocumentById(Role, req.params.id, req.body)
    if (!updatedRole) {
      return errorResponse(res, 'Role not found', httpStatus.NOT_FOUND)
    }
    return successResponse(res, 'Role updated successfully', updatedRole)
  } catch (error) {
    return errorResponse(res, error.message)
  }
}

// Delete a role by ID
export const deleteRole = async (req, res) => {
  try {
    console.log(req.params.id)

    const deletedRole = await deleteDocumentById(Role, req.params.id)

    if (!deletedRole) {
      return errorResponse(res, 'Role not found', httpStatus.NOT_FOUND)
    }
    return successResponse(res, 'Role deleted successfully', deletedRole)
  } catch (error) {
    return errorResponse(res, error.message)
  }
}

const createRoleM = async () => {
  const role = Role.create({
    name: 'admin',
    tasks: {
      add: true,
      read: true,
      update: true,
      delete: true
    },
    roles: {
      add: true,
      read: true,
      update: true,
      delete: true
    },
    users: {
      add: true,
      read: true,
      update: true,
      delete: true
    },
    createdBy: null,
    createdAt: '2025-01-10T12:00:00.000Z',
    updatedAt: '2025-01-10T12:00:00.000Z'
  })
  return console.log(role)
}

// createRoleM()
