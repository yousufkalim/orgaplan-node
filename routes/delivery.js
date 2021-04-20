const router = require("express").Router();
const auth = require("../middlewares/auth");
const deliveryController = require("../controllers/delivery");

// GETS
router.get("/", auth(), deliveryController.getAll);
router.get("/:id", auth(), deliveryController.getOne);

// POSTS
router.post("/", auth(), deliveryController.create);
// PUTS
router.put("/:id", deliveryController.update);
router.put("/updateStatus/:id", deliveryController.updateStatus);
// DELETES
router.delete("/:id", deliveryController.delete);
module.exports = router;
