import { Schema, model } from 'mongoose'

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      default: 'user'
    },
    twoFactorAuth: {
      type: Boolean,
      default: false
    },
    twoFactorAuthCode: {
      type: String
    },
    changedPasswordAt: {
      type: Date,
      required: false
    },
    changedPasswordCode: {
      type: String,
      required: false
    },
    // Add more fields as needed

    isEmailVerified: {
      type: Boolean,
      required: false,
      default: false
    },
    activationCode: {
      type: String,
      required: false,
      default: null
    },
    reToken: {
      type: String,
      required: false,
      default: null
    },
    forgetPasswordCode: {
      type: String,
      required: false,
      default: null
    },
    passwordChangeAt: {
      type: Date,
      required: false,
      default: null
    },
    adminId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false
    },
    permissions: {
      type: {
        add: { type: Boolean, default: true },
        edit: { type: Boolean, default: true },
        delete: { type: Boolean, default: true },
        view: { type: Boolean, default: true }
      }
    }
  },

  {
    timestamps: true
  }
)

const User = model('User', userSchema)

export default User
