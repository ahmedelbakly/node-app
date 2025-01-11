// create task model schema
import { Schema, model } from 'mongoose'

const taskSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    status: {
      type: String,
      default: 'to do',
      enum: ['to do', 'in progress', 'done']
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    dueDate: {
      type: Date,
      required: true
    },
    priority: {
      type: String,
      default: 'low',
      enum: ['low', 'medium', 'high']
    },
    adminId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
)

const Task = model('Task', taskSchema)

export default Task
