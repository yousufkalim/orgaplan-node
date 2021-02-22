const router = require("express").Router();

const auth = require("../../middlewares/auth");
const multer = require("../../middlewares/multer");
const superAdminClientsController = require("../../controllers/SuperAdmin");

// GETS
router.get("/", superAdminClientsController.adminsController.getAll);
router.get("/:id", superAdminClientsController.adminsController.getById);

// POSTS
router.post(
  "/",
  multer("user", "image", "single"),
  superAdminClientsController.adminsController.create
);

// PUTS
router.put(
  "/",
  multer("user", "image", "single"),
  superAdminClientsController.adminsController.update
);

// DELETES
router.delete("/", superAdminClientsController.adminsController.delete);

module.exports = router;
