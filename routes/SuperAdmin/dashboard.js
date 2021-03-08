const router = require("express").Router();

const auth = require("../../middlewares/auth");
const superAdmin = require("../../controllers/SuperAdmin");

// GETS
router.get("/", superAdmin.dashboardController.getAll);

module.exports = router;
