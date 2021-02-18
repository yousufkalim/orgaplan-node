const router = require("express").Router();

router.use("/v1/auth", require("./auth"));
router.use("/v1/users", require("./user"));
router.use("/v1/client", require("./client"));
router.use("/v1/subscription", require("./subscription"));
router.use("/v1/site", require("./site"));
router.use("/v1/site-panelty", require("./sitePenalties"));
router.use("/v1/zac", require("./zac"));
router.use("/v1/building", require("./building"));
router.use("/v1/contract", require("./contract"));
router.use("/v1/trades", require("./trades"));
router.use("/v1/mean", require("./mean"));
router.use("/v1/incidents", require("./incidents"));
router.use("/v1/delivery", require("./delivery"));
router.use("/v1/delivery-area", require("./deliveryArea"));
router.use("/v1/storage-area", require("./storageArea"));
router.use("/v1/level", require("./level"));
router.use("/v1/user-sites", require("./userSites"));
router.use("/v1/company", require("./company"));
router.use("/v1/company_trades", require("./companyTrades"));
router.use("/v1/site-incidents", require("./siteIncidents"));
router.use("/v1/company-sites", require("./siteCompanies"));

router.use("/v1/superadmin", require("./SuperAdmin"));

module.exports = router;
