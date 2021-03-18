const router = require("express").Router();

router.use("/companies", require("./companies"));

module.exports = router;
