const router = require("express").Router();

router.use("/clients", require("./clients"));
router.use("/admins", require("./admins"));

module.exports = router;
