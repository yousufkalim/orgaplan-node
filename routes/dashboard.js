const router = require("express").Router();
const auth = require("../middlewares/auth");
const upload = require("../middlewares/multer");

const superadminDashboardController = require("../controllers/dashboard");
// GETS
router.get("/super-admin/", auth(), superadminDashboardController.getAll);

module.exports = router;
