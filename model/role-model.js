import { Schema, model } from "mongoose";

const roleSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    taskPermissions: {
      type: [String],
      required: true,
      default: ["create", "read", "update", "delete"],
    },
  },
  {
    timestamps: true,
  }
);

export default model("Role", roleSchema);
