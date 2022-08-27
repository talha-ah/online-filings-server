const router = require("express").Router()

const tasks = require("./tasks")
const projects = require("./projects")
const aggregations = require("./aggregations")

router.use("/tasks", tasks)
router.use("/projects", projects)
router.use("/aggregations", aggregations)

module.exports = router
