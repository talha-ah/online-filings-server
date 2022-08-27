const dayjs = require("dayjs")
const { getDB } = require("../../../config/db")

/**
 * Get all the tasks that have a project with a due date set to “today”
 *
 * @param {} -  function payload
 * @returns {object} - tasks
 */
module.exports.getTasks = async () => {
  const DB = getDB().collection("tasks")

  const start = new Date(dayjs().startOf("day"))
  const end = new Date(dayjs().endOf("day"))
  // OR
  // const start = new Date(new Date().setHours(0, 0, 0, 0))
  // const end = new Date(
  //   new Date(new Date().setDate(new Date().getDate() + 1)).setHours(0, 0, 0, 0)
  // )

  const response = await DB.aggregate([
    // // Mongo 5.0 and above
    // {
    //   $lookup: {
    //     from: "projects",
    //     localField: "_id",
    //     foreignField: "tasks",
    //     as: "projects",
    //     pipeline: [
    //       {
    //         $match: {
    //           dueAt: {
    //             $gte: start,
    //             $lte: end,
    //           },
    //         },
    //       },
    //     ],
    //   },
    // },
    // {
    //   $unwind: "$projects",
    // },
    // Mongo 4.2 and above
    {
      $lookup: {
        from: "projects",
        localField: "_id",
        foreignField: "tasks",
        as: "projects",
      },
    },
    {
      $addFields: {
        projects: {
          $filter: {
            input: "$projects",
            as: "project",
            cond: {
              $and: [
                { $gte: ["$$project.dueAt", start] },
                { $lte: ["$$project.dueAt", end] },
              ],
            },
          },
        },
      },
    },
    {
      $unwind: "$projects",
    },
  ]).toArray()

  return response
}

/**
 * Get all the projects
 *
 * @param {} -  function payload
 * @returns {object} - projects
 */
module.exports.getProjects = async () => {
  const DB = getDB().collection("projects")

  const start = new Date(dayjs().startOf("day"))
  const end = new Date(dayjs().endOf("day"))
  // OR
  // const start = new Date(new Date().setHours(0, 0, 0, 0))
  // const end = new Date(
  //   new Date(new Date().setDate(new Date().getDate() + 1)).setHours(0, 0, 0, 0)
  // )

  const response = await DB.aggregate([
    // Mongo 5.0 and above
    // {
    //   $lookup: {
    //     from: "tasks",
    //     localField: "tasks",
    //     foreignField: "_id",
    //     as: "tasks",
    //     pipeline: [
    //       {
    //         $match: {
    //           dueAt: {
    //             $gte: start,
    //             $lte: end,
    //           },
    //         },
    //       },
    //     ],
    //   },
    // },
    // {
    //   $unwind: "$tasks",
    // },
    // Mongo 4.2 and above
    {
      $lookup: {
        as: "tasks",
        from: "tasks",
        localField: "tasks",
        foreignField: "_id",
      },
    },
    {
      $addFields: {
        tasks: {
          $filter: {
            input: "$tasks",
            as: "project",
            cond: {
              $and: [
                { $gte: ["$$project.dueAt", start] },
                { $lte: ["$$project.dueAt", end] },
              ],
            },
          },
        },
      },
    },
    {
      $unwind: "$tasks",
    },
    // all
    {
      $project: {
        tasks: 0,
      },
    },
  ]).toArray()

  return response
}
