const router = require("express").Router();

router.use("/v1/auth", require("./auth"));
router.use("/v1/users", require("./user"));
router.use("/v1/request-quote", require("./requestQuote"));
router.use("/v1/subscription", require("./subscription"));
router.use("/v1/site", require("./site"));
router.use("/v1/user-sites", require("./userSites"));
router.use("/v1/company", require("./company"));

module.exports = router;
