const mongoose = require("mongoose")
const Schema = mongoose.Schema

const model = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    dueAt: {
      type: Date,
      required: true,
    },
    startAt: {
      type: Date,
      default: new Date(),
    },
    doneAt: {
      type: Date,
    },
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "completed"],
    },
  },
  { versionKey: false, timestamps: true }
)

module.exports = mongoose.model("task", model)
