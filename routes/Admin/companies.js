const router = require("express").Router();

const multer = require("../../middlewares/multer");
const admin = require("../../controllers/Admin");

// GETS
router.get("/", admin.companiesController.getAll);
router.get("/get/:id", admin.companiesController.getById);

// POSTS
router.post(
  "/",
  multer("site", "logo", "single"),
  admin.companiesController.create
);

// PUTS
router.put(
  "/",
  multer("site", "logo", "single"),
  admin.companiesController.update
);

// DELETES
router.delete("/delete/:id", admin.companiesController.delete);

module.exports = router;
