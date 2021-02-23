const router = require("express").Router();

const auth = require("../../middlewares/auth");
const multer = require("../../middlewares/multer");
const superAdmin = require("../../controllers/SuperAdmin");

// GETS
router.get("/", superAdmin.sitesController.getAll);
router.get("/:id", superAdmin.sitesController.getById);

// POSTS
router.post(
  "/",
  multer("site", "logo", "single"),
  superAdmin.sitesController.create
);

// PUTS
router.put(
  "/",
  multer("site", "logo", "single"),
  superAdmin.sitesController.update
);

// DELETES
router.delete("/:id", superAdmin.sitesController.delete);

module.exports = router;
