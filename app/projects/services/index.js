const ENV = process.env
const ObjectId = require("mongodb").ObjectId

const { errors } = require("../../../utils/texts")
const { CustomError } = require("../../../utils/customError")

const Model = require("../models")
const TaskService = require("../../tasks/services")

/**
 * Get all the documents
 *
 * @param {object} data - function payload
 * @param {string} data.page - page number
 * @param {string} data.limit - limit per page
 * @param {string} data.search - (filters) search query string
 * @param {string} data.sort - (filters) asc or desc
 * @param {string} data.sortType - (filters) startAt, dueAt
 * @returns {object} - project
 */
module.exports.getProjects = async (data) => {
  const page = +data.page || 1
  const limit = +data.limit || +ENV.LIMIT

  // DB query
  const query = {
    name: {
      $regex: `.*${data.search || ""}.*`,
      $options: "i",
    },
  }

  // Sort query
  const sort = {
    [data.sortType || "startAt"]: data.sort === "desc" ? -1 : 1, // sort by desc or asc
  }

  // Get the documents
  const response = await Model.aggregate([
    { $match: query },
    {
      $lookup: {
        from: "tasks",
        localField: "tasks",
        foreignField: "_id",
        as: "tasks",
      },
    },
    {
      $sort: sort,
    },
    {
      $skip: (page - 1) * limit,
    },
    {
      $limit: limit,
    },
  ])

  // Get the total count
  const totalData = await Model.find(query).countDocuments()

  // Return the documents
  return {
    response,
    totalData,
    page: page,
    limit: limit,
    totalPages: Math.ceil(totalData / limit),
  }
}

/**
 * Get the document
 *
 * @param {object} data - function payload
 * @param {string} data.id - id of the project
 * @returns {object} - project
 */
module.exports.getProject = async (data) => {
  // Get the document
  const response = await Model.aggregate([
    { $match: { _id: ObjectId(data.id) } },
    {
      $lookup: {
        from: "tasks",
        localField: "tasks",
        foreignField: "_id",
        as: "tasks",
      },
    },
  ])

  // Check for errors
  if (!response[0]) throw new CustomError(errors.projectNotFound, 400)

  return response[0]
}

/**
 * Create a new document
 *
 * @param {object} data - function payload
 * @param {string} data.name - name of the project
 * @returns {object} - inserted project
 */
module.exports.createProject = async (data) => {
  // Insert the document
  let response = await Model.create(data)

  // Check for errors
  if (!response) throw new CustomError(errors.error, 400)

  // Return the inserted document
  return response
}

/**
 * Update the document
 *
 * @param {object} data - function payload
 * @param {string} data.id - id of the project
 * @param {string} data.name - name of the project
 * @param {string} data.dueAt - dueAt of the project
 * @returns {object} - updated project
 */
module.exports.updateProject = async (data) => {
  // Update the document
  let response = await Model.findOneAndUpdate(
    {
      _id: ObjectId(data.id),
    },
    {
      $set: data,
    },
    {
      new: true,
    }
  ).lean()

  // Check for errors
  if (!response) throw new CustomError(errors.projectNotFound, 400)

  // Return the updated document
  return response
}

/**
 * Hard delete the document
 *
 * @param {object} data - function payload
 * @param {string} data.id - id of the project
 * @returns {object} - deleted project
 */
module.exports.deleteProject = async (data) => {
  // Delete the document
  const response = await Model.findOneAndDelete({
    _id: ObjectId(data.id),
  }).lean()

  // Check for errors
  if (!response) throw new CustomError(errors.projectNotFound, 400)

  return response
}

/**
 * Add a task to the project
 *
 * @param {object} data - function payload
 * @param {string} data.id - id of the project
 * @param {string} data.taskId - id of the task
 * @returns {object} - updated project
 */
module.exports.addTask = async (data) => {
  // Check if the task exists
  await TaskService.getTask({ id: data.taskId })

  // Update the document
  let response = await Model.findOneAndUpdate(
    {
      _id: ObjectId(data.id),
    },
    {
      $addToSet: {
        tasks: ObjectId(data.taskId),
      },
    },
    {
      new: true,
    }
  ).lean()

  // Check for errors
  if (!response) throw new CustomError(errors.projectNotFound, 400)

  // Return the updated document
  return response
}

/**
 * Add or move a task to the project
 *
 * @param {object} data - function payload
 * @param {string} data.fromProjectId - id of the project to move from (optional)
 * @param {string} data.toProjectId - id of the project to add to
 * @param {string} data.taskId - id of the task
 * @returns {object} - updated project
 */
module.exports.addOrMoveTask = async (data) => {
  // Check if the task exists
  await TaskService.getProject({ id: data.taskId })

  // Remove task from the project if it exists
  if (data.fromProjectId) {
    let checkFrom

    // Overwrite the error message if the project doesn't exist
    try {
      // Check if the project exists
      checkFrom = await this.getProject({ id: data.fromProjectId })
    } catch (error) {
      throw new CustomError(errors.fromProjectNotFound, 400)
    }

    if (!checkFrom) {
      throw new CustomError(errors.fromProjectNotFound, 400)
    }

    // if the task is in the project
    const checkTask = checkFrom.tasks.find(
      (task) => String(task._id) === String(data.taskId)
    )
    if (!checkTask) throw new CustomError(errors.fromProjectTaskNotFound, 400)

    // Remove the task from the project
    const fromProject = await Model.findOneAndUpdate(
      {
        _id: ObjectId(data.fromProjectId),
      },
      {
        $pull: {
          tasks: ObjectId(data.taskId),
        },
      },
      {
        new: true,
      }
    ).lean()

    // Check for errors
    if (!fromProject) throw new CustomError(errors.fromProjectNotFound, 400)
  }

  // Update the document
  let response = await Model.findOneAndUpdate(
    {
      _id: ObjectId(data.toProjectId),
    },
    {
      $addToSet: {
        tasks: ObjectId(data.taskId),
      },
    },
    {
      new: true,
    }
  ).lean()

  // Check for errors
  if (!response) throw new CustomError(errors.projectNotFound, 400)

  // Return the updated document
  return response
}
