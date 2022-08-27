const { texts } = require("../../../utils/texts")
const { CustomResponse } = require("../../../utils/customResponse")

const Service = require("../services")

module.exports.getTasks = async (req, res) => {
  const response = await Service.getTasks()

  res.status(200).json(CustomResponse(texts.aggregations, response))
}

module.exports.getProjects = async (req, res) => {
  const response = await Service.getProjects()

  res.status(200).json(CustomResponse(texts.aggregations, response))
}
