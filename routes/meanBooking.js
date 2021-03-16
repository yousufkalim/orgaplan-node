const router = require("express").Router();
const auth = require("../middlewares/auth");
const meanBookingController = require("../controllers/meanBooking");
// GETS
router.get("/", auth(), meanBookingController.getAll);
router.get("/get/:id", auth(), meanBookingController.getOne);
// POSTS
router.post("/", auth(), meanBookingController.create);
// PUTS
router.put("/update/:id", meanBookingController.update);
// DELETES
router.delete("/delete/:id", meanBookingController.delete);
module.exports = router;
