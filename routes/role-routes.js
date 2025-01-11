import express from 'express'
import { isAuth } from '../helper/isAuth.js'
import {
  createRole,
  getAllRoles,
  getRoleById,
  updateRole,
  deleteRole
} from '../controller/role-controller.js' // Adjust the path to your controller file

const roleRouter = express.Router()
roleRouter.use(isAuth)

// Routes for role management
roleRouter.post('/', createRole) // Create a new role
roleRouter.get('/', getAllRoles) // Get all roles
roleRouter.get('/:id', getRoleById) // Get a role by ID
roleRouter.put('/:id', updateRole) // Update a role by ID
roleRouter.delete('/:id', deleteRole) // Delete a role by ID

export default roleRouter
