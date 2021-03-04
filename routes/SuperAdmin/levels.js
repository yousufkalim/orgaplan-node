const router = require("express").Router();

const auth = require("../../middlewares/auth");
const multer = require("../../middlewares/multer");
const superAdmin = require("../../controllers/SuperAdmin");

// GETS
router.get("/", superAdmin.levelsController.getAll);
router.get("/get/:id", superAdmin.levelsController.getById);
router.get("/building/:id", superAdmin.levelsController.getAllByBuilding);

// POSTS
router.post(
  "/",
  multer("level", "image", "single"),
  superAdmin.levelsController.create
);

// PUTS
router.put(
  "/",
  multer("level", "image", "single"),
  superAdmin.levelsController.update
);
router.put(
  "/image",
  multer("level", "image", "single"),
  superAdmin.levelsController.updateImage
);

// DELETES
router.delete("/delete/:id", superAdmin.levelsController.delete);

module.exports = router;
