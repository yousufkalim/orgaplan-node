const router = require("express").Router();

const auth = require("../middlewares/auth");
const subscriptionController = require("../controllers/subscription");

// GETS
router.get("/", auth("admin"), subscriptionController.getAll);
router.get("/:userId", auth("admin"), subscriptionController.getOne);

// POSTS
router.post("/", subscriptionController.create);

// PUTS
router.put("/:userId", auth("admin"), subscriptionController.update);

// DELETES
router.delete("/:userId", auth("admin"), subscriptionController.delete);

module.exports = router;
