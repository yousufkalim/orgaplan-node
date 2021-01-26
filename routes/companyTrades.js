const router = require("express").Router();
const auth = require("../middlewares/auth");
const companyTradesController = require("../controllers/companyTrades");
// GETS
router.get("/", auth(), companyTradesController.getAll);
router.get("/:id", auth(), companyTradesController.getOne);
// POSTS
router.post("/", auth(), companyTradesController.create);
// PUTS
router.put("/:id", companyTradesController.update);
// DELETES
router.delete("/:id", companyTradesController.delete);
module.exports = router;
