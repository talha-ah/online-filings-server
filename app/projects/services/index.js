const ENV = process.env
const ObjectId = require("mongodb").ObjectID

const { getDB } = require("../../../config/db")
const { errors } = require("../../../utils/texts")
const { CustomError } = require("../../../utils/customError")

const TaskService = require("../../tasks/services")

const COLLECTION = "projects"

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
module.exports.getAll = async (data) => {
  const page = +data.page || 1
  const limit = +data.limit || +ENV.LIMIT

  // DB query
  const query = {
    name: {
      $regex: ".*" + data.search || "" + ".*",
      $options: "i",
    },
  }

  // Sort query
  const sort = {
    [data.sortType || "startAt"]: data.sort === "desc" ? -1 : 1, // sort by desc or asc
  }

  // Get the DB connection
  const DB = getDB().collection(COLLECTION)

  // Get the documents
  const response = await DB.aggregate([
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
  ]).toArray()

  // Get the total count
  const totalData = await DB.find(query).count()

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
module.exports.getOne = async (data) => {
  // Get the DB connection
  const DB = getDB().collection(COLLECTION)

  // Get the document
  const response = await DB.aggregate([
    { $match: { _id: ObjectId(data.id) } },
    {
      $lookup: {
        from: "tasks",
        localField: "tasks",
        foreignField: "_id",
        as: "tasks",
      },
    },
  ]).toArray()

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
module.exports.createOne = async (data) => {
  // Get the DB connection
  const DB = getDB().collection(COLLECTION)

  // Set default values
  data.tasks = []
  data.startAt = new Date()

  // Insert the document
  let response = await DB.insertOne(data)

  // Check for errors
  if (!response || !response.insertedId)
    throw new CustomError(errors.error, 400)

  // Get the inserted document
  response = await this.getOne({ id: response.insertedId })

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
module.exports.updateOne = async (data) => {
  // Get the DB connection
  const DB = getDB().collection(COLLECTION)

  // Separate the id from the data otherise the id will also be added document
  const { id, ...body } = data

  // Update the document
  let response = await DB.findOneAndUpdate(
    {
      _id: ObjectId(id),
    },
    {
      $set: body,
    }
  )

  // Check for errors
  if (!response || response.lastErrorObject.n === 0)
    throw new CustomError(errors.projectNotFound, 400)

  // Get the updated document
  response = await this.getOne(data)

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
module.exports.deleteOne = async (data) => {
  // Get the DB connection
  const DB = getDB().collection(COLLECTION)

  // Get the document to delete
  const response = await this.getOne(data)

  // Delete the document
  const check = await DB.deleteOne({
    _id: ObjectId(data.id),
  })

  // Check for errors
  if (!check || check.deletedCount === 0)
    throw new CustomError(errors.projectNotFound, 400)

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
  // Get the DB connection
  const DB = getDB().collection(COLLECTION)

  // Check if the task exists
  await TaskService.getOne({ id: data.taskId })

  // Check if the project exists
  await this.getOne({ id: data.toProjectId })

  // Remove task from the project if it exists
  if (data.fromProjectId) {
    let checkFrom

    // Overwrite the error message if the project doesn't exist
    try {
      // Check if the project exists
      checkFrom = await this.getOne({ id: data.fromProjectId })
    } catch (error) {
      throw new CustomError(errors.fromProjectNotFound, 400)
    }

    // if the task is in the project
    const checkTask = checkFrom.tasks.find(
      (task) => String(task._id) === String(data.taskId)
    )
    if (!checkTask) throw new CustomError(errors.fromProjectTaskNotFound, 400)

    // Remove the task from the project
    const fromProject = await DB.findOneAndUpdate(
      {
        _id: ObjectId(data.fromProjectId),
      },
      {
        $pull: {
          tasks: ObjectId(data.taskId),
        },
      }
    )

    // Check for errors
    if (!fromProject || fromProject.lastErrorObject.n === 0)
      throw new CustomError(errors.fromProjectNotFound, 400)
  }

  // Update the document
  let response = await DB.findOneAndUpdate(
    {
      _id: ObjectId(data.toProjectId),
    },
    {
      $addToSet: {
        tasks: ObjectId(data.taskId),
      },
    }
  )

  // Check for errors
  if (!response || response.lastErrorObject.n === 0)
    throw new CustomError(errors.projectNotFound, 400)

  // Get the updated document
  response = await this.getOne({ id: data.toProjectId })

  // Return the updated document
  return response
}
