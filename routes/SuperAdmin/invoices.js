const router = require("express").Router();

const auth = require("../../middlewares/auth");
const superAdmin = require("../../controllers/SuperAdmin");

// GETS
router.get("/:clientId", superAdmin.invoicesController.getAll);
router.get("/:id", superAdmin.invoicesController.getById);

// POSTS
router.post("/", superAdmin.invoicesController.create);

// PUTS
router.put("/", superAdmin.invoicesController.update);

// DELETES
router.delete("/:id", superAdmin.invoicesController.delete);

module.exports = router;
