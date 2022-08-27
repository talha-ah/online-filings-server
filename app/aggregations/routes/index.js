const router = require("express").Router()

const controller = require("../controllers")

router.get("/tasks", controller.getTasks)
router.get("/projects", controller.getProjects)

module.exports = router
