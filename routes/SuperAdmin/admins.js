const router = require("express").Router();

const auth = require("../../middlewares/auth");
const multer = require("../../middlewares/multer");
const superAdmin = require("../../controllers/SuperAdmin");

// GETS
router.get("/", superAdmin.adminsController.getAll);
router.get("/:id", superAdmin.adminsController.getById);

// POSTS
router.post(
  "/",
  multer("user", "image", "single"),
  superAdmin.adminsController.create
);

// PUTS
router.put(
  "/",
  multer("user", "image", "single"),
  superAdmin.adminsController.update
);

// DELETES
router.delete("/", superAdmin.adminsController.delete);

module.exports = router;
