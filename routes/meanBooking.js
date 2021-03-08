const router = require("express").Router();
const auth = require("../middlewares/auth");
const meanBookingController = require("../controllers/meanBooking");
// GETS
router.get("/", auth(), meanBookingController.getAll);
router.get("/:id", auth(), meanBookingController.getOne);
// POSTS
router.post("/", auth(), meanBookingController.create);
// PUTS
router.put("/:id", meanBookingController.update);
// DELETES
router.delete("/:id", meanBookingController.delete);
module.exports = router;
