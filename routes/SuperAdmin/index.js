const router = require("express").Router();

router.use("/clients", require("./clients"));

module.exports = router;
