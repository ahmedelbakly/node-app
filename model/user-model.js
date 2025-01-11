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
      type: Schema.Types.ObjectId,
      ref: 'Role',
      required: true
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
    type: {
      type: String,
      enum: ['user', 'admin'],
      default: 'admin'
    }
  },

  {
    timestamps: true
  }
)

const User = model('User', userSchema)

export default User
