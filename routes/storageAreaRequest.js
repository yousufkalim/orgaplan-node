const router = require("express").Router();
const auth = require("../middlewares/auth");
const storageAreaRequestController = require("../controllers/storageAreaRequest");

router.get("/:siteId", storageAreaRequestController.getSiteRequest);

router.get("/reject/:id", storageAreaRequestController.rejectRequest);

router.post("/accept", storageAreaRequestController.acceptRequest);

router.post("/", storageAreaRequestController.create);
module.exports = router;
