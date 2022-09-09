const router = require("express").Router()

const controller = require("../controllers")

router.put("/status/:id", controller.updateStatus)

router.get("/", controller.getTasks)
router.get("/:id", controller.getTask)
router.post("/", controller.createTask)
router.put("/:id", controller.updateTask)
router.delete("/:id", controller.deleteTask)

module.exports = router
