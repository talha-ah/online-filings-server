const ObjectId = require("mongodb").ObjectID

const model = {
  name: {
    type: String,
    required: true,
  },
  startAt: {
    type: Date,
    default: new Date(),
  },
  dueAt: {
    type: Date,
    default: new Date(),
  },
  tasks: [
    {
      ref: "tasks",
      type: ObjectId,
    },
  ],
}

module.exports = model
