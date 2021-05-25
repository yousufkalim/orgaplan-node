const router = require("express").Router();
const auth = require("../middlewares/auth");
const notificationController = require("../controllers/notification");
// GETS
router.get("/send", notificationController.send);
module.exports = router;
