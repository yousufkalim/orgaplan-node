const router = require("express").Router();
const superAdmin = require("../../controllers/SuperAdmin");

// POSTS
router.post("/", superAdmin.contactsController.create);

module.exports = router;
