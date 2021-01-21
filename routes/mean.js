const router = require("express").Router();
const auth = require("../middlewares/auth");
const upload = require("../middlewares/multer");

const meanController = require("../controllers/mean");
// GETS
router.get("/", auth(), meanController.getAll);
router.get("/:id", auth(), meanController.getOne);
// POSTS
router.post("/", auth(), upload("mean", "sheet"), meanController.create);
// PUTS
router.put("/:id", auth(), upload("mean", "sheet"), meanController.update);
// DELETES
router.delete("/:id", meanController.delete);
module.exports = router;
