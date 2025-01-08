// create task model schema
import { Schema, model } from 'mongoose'

const taskSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    status: {
      type: String,
      default: 'to do',
      enum: ['to do', 'in progress', 'done']
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    dueDate: {
      type: Date,
      required: true
    },
    priority: {
      type: String,
      default: 'low',
      enum: ['low', 'medium', 'high']
    }
  },
  { timestamps: true }
)

const Task = model('Task', taskSchema)

export default Task
