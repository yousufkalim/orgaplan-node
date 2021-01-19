const router = require("express").Router();
const auth = require("../middlewares/auth");
const tradeController = require("../controllers/trades");
// GETS
router.get("/", auth(), tradeController.getAll);
router.get("/:id", auth(), tradeController.getOne);
// POSTS
router.post("/", auth(), tradeController.create);
// PUTS
router.put("/:id", tradeController.update);
// DELETES
router.delete("/:id", tradeController.delete);
module.exports = router;
