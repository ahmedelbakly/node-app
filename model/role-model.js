import { Schema, model } from 'mongoose'

const roleSchema = new Schema(
  {
    name: { type: String, required: true },
    tasks: {
      add: { type: Boolean, default: false },
      read: { type: Boolean, default: false },
      update: { type: Boolean, default: false },
      delete: { type: Boolean, default: false },
      

    },
    roles: {
      add: { type: Boolean, default: false },
      read: { type: Boolean, default: false },
      update: { type: Boolean, default: false },
      delete: { type: Boolean, default: false }
    },
    users: {
      add: { type: Boolean, default: false },
      read: { type: Boolean, default: false },
      update: { type: Boolean, default: false },
      delete: { type: Boolean, default: false }
    },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' }
  },
  {
    timestamps: true
  }
)

const Role = model('Role', roleSchema)

export default Role
