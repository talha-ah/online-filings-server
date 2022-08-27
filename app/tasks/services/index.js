const ENV = process.env
const ObjectId = require("mongodb").ObjectID

const { getDB } = require("../../../config/db")
const { errors } = require("../../../utils/texts")
const { CustomError } = require("../../../utils/customError")

const COLLECTION = "tasks"

/**
 * Get all the documents
 *
 * @param {object} data - function payload
 * @param {string} data.page - page number
 * @param {string} data.limit - limit per page
 * @param {string} data.status - (filters) status of the task (to-do, done)
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
  if (data.status) query["status"] = data.status

  // Sort query
  const sort = {
    [data.sortType || "startAt"]: data.sort === "desc" ? -1 : 1, // sort by desc or asc
  }

  // Get the DB connection
  const DB = getDB().collection(COLLECTION)

  // Get the documents
  const response = await DB.find(query)
    .sort(sort)
    .skip(limit * (page - 1))
    .limit(limit)
    .toArray()

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
 * @param {string} data.id - id of the task
 * @returns {object} - task
 */
module.exports.getOne = async (data) => {
  // Get the DB connection
  const DB = getDB().collection(COLLECTION)

  // Get the document
  const response = await DB.findOne({
    _id: ObjectId(data.id),
  })

  // Check for errors
  if (!response) throw new CustomError(errors.taskNotFound, 400)

  return response
}

/**
 * Create a new document
 *
 * @param {object} data - function payload
 * @param {string} data.name - name of the task
 * @param {string} data.dueAt - dueAt of the task
 * @returns {object} - inserted task
 */
module.exports.createOne = async (data) => {
  // Get the DB connection
  const DB = getDB().collection(COLLECTION)

  // Set default values
  data.status = "to-do"
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
 * @param {string} data.id - id of the task
 * @param {string} data.name - name of the task
 * @param {string} data.dueAt - dueAt of the task
 * @returns {object} - updated task
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
    throw new CustomError(errors.taskNotFound, 400)

  // Get the updated document
  response = await this.getOne(data)

  // Return the updated document
  return response
}

/**
 * Hard delete the document
 *
 * @param {object} data - function payload
 * @param {string} data.id - id of the task
 * @returns {object} - deleted task
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
    throw new CustomError(errors.taskNotFound, 400)

  return response
}

/**
 * Update the document status
 *
 * @param {object} data - function payload
 * @param {string} data.id - id of the task
 * @param {string} data.status - status of the task
 * @returns {object} - updated task
 */
module.exports.updateStatus = async (data) => {
  // Get the DB connection
  const DB = getDB().collection(COLLECTION)

  // Update the doneAt field
  if (data.status === "done") {
    data.doneAt = new Date()
  } else {
    data.startAt = new Date()
    data.doneAt = null
  }

  // Update the document
  let response = await DB.findOneAndUpdate(
    {
      _id: ObjectId(data.id),
    },
    {
      $set: {
        status: data.status,
        doneAt: data.doneAt,
      },
    }
  )

  // Check for errors
  if (!response || response.lastErrorObject.n === 0)
    throw new CustomError(errors.taskNotFound, 400)

  // Get the updated document
  response = await this.getOne(data)

  // Return the updated document
  return response
}
