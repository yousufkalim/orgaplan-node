const router = require("express").Router();
const auth = require("../middlewares/auth");
const storageAreaController = require("../controllers/storageArea");
// GETS
router.get("/", auth(), storageAreaController.getAll);
router.get("/:id", auth(), storageAreaController.getOne);
// POSTS
router.post("/", auth(), storageAreaController.create);
// PUTS
router.put("/:id", storageAreaController.update);
// DELETES
router.delete("/:id", storageAreaController.delete);
module.exports = router;
