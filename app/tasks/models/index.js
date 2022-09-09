const mongoose = require("mongoose")
const Schema = mongoose.Schema

const model = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    startAt: {
      type: Date,
      default: new Date(),
    },
    doneAt: {
      type: Date,
      default: new Date(),
      required: true,
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
