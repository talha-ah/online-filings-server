const { texts } = require("../../../utils/texts")
const { CustomResponse } = require("../../../utils/customResponse")

const Service = require("../services")
const Validations = require("../validations")

module.exports.getAll = async (req, res) => {
  const data = await Validations.getAll({
    ...req.query,
  })

  const response = await Service.getAll(data)

  res.status(200).json(CustomResponse(texts.projects, response))
}

module.exports.getOne = async (req, res) => {
  const data = await Validations.getOne({
    ...req.params,
  })

  const response = await Service.getOne(data)

  res.status(200).json(CustomResponse(texts.projects, response))
}

module.exports.createOne = async (req, res) => {
  const data = await Validations.createOne({
    ...req.body,
  })

  const response = await Service.createOne(data)

  res.status(200).json(CustomResponse(texts.projects, response))
}

module.exports.updateOne = async (req, res) => {
  const data = await Validations.updateOne({
    ...req.params,
    ...req.body,
  })

  const response = await Service.updateOne(data)

  res.status(200).json(CustomResponse(texts.projects, response))
}

module.exports.deleteOne = async (req, res) => {
  const data = await Validations.getOne({
    ...req.params,
  })

  const response = await Service.deleteOne(data)

  res.status(200).json(CustomResponse(texts.projects, response))
}

module.exports.addOrMoveTask = async (req, res) => {
  const data = await Validations.addOrMoveTask({
    ...req.body,
  })

  const response = await Service.addOrMoveTask(data)

  res.status(200).json(CustomResponse(texts.projects, response))
}
