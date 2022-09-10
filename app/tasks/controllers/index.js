const { texts } = require("../../../utils/texts")
const { CustomResponse } = require("../../../utils/customResponse")

const Service = require("../services")
const Validations = require("../validations")

module.exports.getTasks = async (req, res) => {
  const data = await Validations.getTasks({
    ...req.query,
  })

  const response = await Service.getTasks(data)

  res.status(200).json(CustomResponse(texts.tasks, response))
}

module.exports.getTask = async (req, res) => {
  const data = await Validations.getTask({
    ...req.body,
  })

  const response = await Service.getTask(data)

  res.status(200).json(CustomResponse(texts.tasks, response))
}

module.exports.createTask = async (req, res) => {
  const data = await Validations.createTask({
    ...req.body,
  })

  const response = await Service.createTask(data)

  res.status(200).json(CustomResponse(texts.tasks, response))
}

module.exports.updateTask = async (req, res) => {
  const data = await Validations.updateTask({
    ...req.params,
    ...req.body,
  })

  const response = await Service.updateTask(data)

  res.status(200).json(CustomResponse(texts.tasks, response))
}

module.exports.deleteTask = async (req, res) => {
  const data = await Validations.getTask({
    ...req.params,
  })

  const response = await Service.deleteTask(data)

  res.status(200).json(CustomResponse(texts.tasks, response))
}

module.exports.updateStatus = async (req, res) => {
  const data = await Validations.updateStatus({
    ...req.params,
    ...req.body,
  })

  const response = await Service.updateStatus(data)

  res.status(200).json(CustomResponse(texts.tasks, response))
}
