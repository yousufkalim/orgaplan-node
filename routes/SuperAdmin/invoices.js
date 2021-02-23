const router = require("express").Router();

const auth = require("../../middlewares/auth");
const multer = require("../../middlewares/multer");
const superAdmin = require("../../controllers/SuperAdmin");

// GETS
router.get("/:clientId/:contractId", superAdmin.invoicesController.getAll);
router.get("/:id", superAdmin.invoicesController.getById);

// POSTS
router.post(
  "/",
  multer("invoice", "images", "array"),
  superAdmin.invoicesController.create
);

// PUTS
router.put(
  "/",
  multer("invoice", "images", "array"),
  superAdmin.invoicesController.update
);

// DELETES
router.delete("/", superAdmin.invoicesController.delete);

module.exports = router;
