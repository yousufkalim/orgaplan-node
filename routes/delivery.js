const router = require("express").Router();
const auth = require("../middlewares/auth");
const deliveryController = require("../controllers/delivery");

// GETS
router.get("/", auth(), deliveryController.getAll);
router.get("/:id", auth(), deliveryController.getOne);
router.get("/alert/:id", deliveryController.getSiteAlerts);

// POSTS
router.post("/", auth(), deliveryController.create);
// PUTS
router.put("/:id", deliveryController.update);
// DELETES
router.delete("/:id", deliveryController.delete);
module.exports = router;
