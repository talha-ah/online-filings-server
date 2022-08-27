const router = require("express").Router()

const controller = require("../controllers")

router.post("/task", controller.addOrMoveTask)

router.get("/", controller.getAll)
router.post("/", controller.createOne)
router.get("/:id", controller.getOne)
router.put("/:id", controller.updateOne)
router.delete("/:id", controller.deleteOne)

module.exports = router
