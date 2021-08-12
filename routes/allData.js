const router = require("express").Router();
const allDataController = require("../controllers/allData.js");

// GET
router.get("/get/:userId", allDataController.getData);

module.exports = router;
