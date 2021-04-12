const router = require("express").Router();
const auth = require("../middlewares/auth");
const storageAreaRequestController = require("../controllers/storageAreaRequest");

router.get("/:siteId", storageAreaRequestController.getSiteRequest);

router.post("/", storageAreaRequestController.create);
module.exports = router;
