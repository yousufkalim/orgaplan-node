const router = require("express").Router();
const superAdmin = require("../../controllers/SuperAdmin");

// GETS
router.get("/", superAdmin.logsController.getAll);

module.exports = router;
