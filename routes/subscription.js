const router = require("express").Router();

const auth = require("../middlewares/auth");
const subscriptionController = require("../controllers/subscription");

// GETS
router.get("/", auth("admin"), subscriptionController.getAll);
router.get(
  "/active/",

  subscriptionController.getActiveSubscriptions
);

router.get("/:subscriptionId", auth("admin"), subscriptionController.getOne);

// POSTS
router.post("/", subscriptionController.create);

// PUTS
router.put("/:userId", auth("admin"), subscriptionController.update);
router.put(
  "/activate_subscription/:subscriptionId",

  subscriptionController.activateSubscription
);

// DELETES
router.delete("/:subscriptionId", auth("admin"), subscriptionController.delete);

module.exports = router;
