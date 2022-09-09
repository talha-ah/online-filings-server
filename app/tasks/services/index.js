const ENV = process.env
const ObjectId = require("mongodb").ObjectId

const { errors } = require("../../../utils/texts")
const { CustomError } = require("../../../utils/customError")

const Model = require("../models")
const ProjectModel = require("../../projects/models")
const ProjectService = require("../../projects/services")

/**
 * Get all the documents
 *
 * @param {object} data - function payload
 * @param {string} data.page - page number
 * @param {string} data.limit - limit per page
 * @param {string} data.status - (filters) status of the task (pending, done)
 * @param {string} data.search - (filters) search query string
 * @param {string} data.sort - (filters) asc or desc
 * @param {string} data.sortType - (filters) startAt, dueAt
 * @returns {object} - Task
 */
module.exports.getTasks = async (data) => {
  const page = +data.page || 1
  const limit = +data.limit || +ENV.LIMIT

  // DB query
  const query = {
    name: {
      $regex: `.*${data.search || ""}.*`,
      $options: "i",
    },
  }
  if (data.status) query["status"] = data.status

  // Sort query
  const sort = {
    [data.sortType || "startAt"]: data.sort === "desc" ? -1 : 1, // sort by desc or asc
  }

  // Get the documents
  let response = []
  let totalData = 0

  if (data.projectId) {
    response = await ProjectModel.aggregate([
      {
        $match: {
          _id: ObjectId(data.projectId),
        },
      },
      {
        $lookup: {
          from: "tasks",
          localField: "tasks",
          foreignField: "_id",
          as: "tasks",
          pipeline: [
            {
              $match: query,
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
          ],
        },
      },
      {
        $unwind: {
          path: "$tasks",
        },
      },
      {
        $replaceRoot: {
          newRoot: "$tasks",
        },
      },
    ])

    totalData = await ProjectModel.aggregate([
      {
        $match: {
          _id: ObjectId(data.projectId),
        },
      },
      {
        $lookup: {
          from: "tasks",
          localField: "tasks",
          foreignField: "_id",
          as: "tasks",
          pipeline: [
            {
              $match: query,
            },
          ],
        },
      },
      {
        $unwind: {
          path: "$tasks",
        },
      },
      {
        $replaceRoot: {
          newRoot: "$tasks",
        },
      },
      {
        $count: "total",
      },
    ])

    // Get the total count
    totalData = totalData.length ? totalData[0].total : 0
  } else {
    response = await Model.find(query)
      .sort(sort)
      .skip(limit * (page - 1))
      .limit(limit)
      .lean()

    // Get the total count
    totalData = await Model.find(query).countDocuments()
  }

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
module.exports.getTask = async (data) => {
  // Get the document
  const response = await Model.findOne({
    _id: ObjectId(data.id),
  }).lean()

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
module.exports.createTask = async (data) => {
  // Insert the document
  let response = await Model.insertOne(data)

  // Check for errors
  if (!response) throw new CustomError(errors.error, 400)

  // Add the task to the project
  await ProjectService.addTask({
    id: data.projectId,
    taskId: response._id,
  })

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
module.exports.updateTask = async (data) => {
  // Update the document
  let response = await Model.findOneAndUpdate(
    {
      _id: ObjectId(data.id),
    },
    {
      $set: body,
    },
    {
      new: true,
    }
  ).lean()

  // Check for errors
  if (!response) throw new CustomError(errors.taskNotFound, 400)

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
module.exports.deleteTask = async (data) => {
  // Delete the document
  const response = await Model.findOneAndDelete({
    _id: ObjectId(data.id),
  }).lean()

  // check for errors
  if (!response) throw new CustomError(errors.taskNotFound, 400)

  // return the deleted document
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
  // Update the doneAt field
  if (data.status === "done") {
    data.doneAt = new Date()
  } else {
    data.startAt = new Date()
    data.doneAt = null
  }

  // Update the document
  let response = await Model.findOneAndUpdate(
    {
      _id: ObjectId(data.id),
    },
    {
      $set: {
        status: data.status,
        doneAt: data.doneAt,
      },
    },
    {
      new: true,
    }
  ).lean()

  // Check for errors
  if (!response) throw new CustomError(errors.taskNotFound, 400)

  // Return the updated document
  return response
}
