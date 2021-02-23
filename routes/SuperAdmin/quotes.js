const router = require("express").Router();

const auth = require("../../middlewares/auth");
const superAdmin = require("../../controllers/SuperAdmin");

// GETS
router.get("/", superAdmin.quotesController.getAll);
router.get("/:id", superAdmin.quotesController.getById);

// POSTS
router.post("/", superAdmin.quotesController.create);

// DELETES
router.delete("/:id", superAdmin.quotesController.delete);

module.exports = router;
