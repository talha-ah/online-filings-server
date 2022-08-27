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
  doneAt: {
    type: Date,
    default: new Date(),
  },
  status: {
    type: String,
    default: "to-do",
    enum: ["to-do", "done"],
  },
}

module.exports = model
