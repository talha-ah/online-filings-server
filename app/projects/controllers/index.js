const { texts } = require("../../../utils/texts")
const { CustomResponse } = require("../../../utils/customResponse")

const Service = require("../services")
const Validations = require("../validations")

module.exports.getProjects = async (req, res) => {
  const data = await Validations.getProjects({
    ...req.query,
  })

  const response = await Service.getProjects(data)

  res.status(200).json(CustomResponse(texts.projects, response))
}

module.exports.getProject = async (req, res) => {
  const data = await Validations.getProject({
    ...req.params,
  })

  const response = await Service.getProject(data)

  res.status(200).json(CustomResponse(texts.projects, response))
}

module.exports.createProject = async (req, res) => {
  const data = await Validations.createProject({
    ...req.body,
  })

  const response = await Service.createProject(data)

  res.status(200).json(CustomResponse(texts.projects, response))
}

module.exports.updateProject = async (req, res) => {
  const data = await Validations.updateProject({
    ...req.params,
    ...req.body,
  })

  const response = await Service.updateProject(data)

  res.status(200).json(CustomResponse(texts.projects, response))
}

module.exports.deleteProject = async (req, res) => {
  const data = await Validations.getProject({
    ...req.params,
  })

  const response = await Service.deleteProject(data)

  res.status(200).json(CustomResponse(texts.projects, response))
}

module.exports.addOrMoveTask = async (req, res) => {
  const data = await Validations.addOrMoveTask({
    ...req.body,
  })

  const response = await Service.addOrMoveTask(data)

  res.status(200).json(CustomResponse(texts.projects, response))
}
