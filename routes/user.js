const router = require("express").Router();

const auth = require("../middlewares/auth");
const upload = require("../middlewares/multer");
const userController = require("../controllers/user");

// GETS
router.get("/", auth("admin"), userController.getAll);
router.get("/:userId", userController.getOne);
router.get("/add_user/:siteId/:adminId", userController.getAddUser);

//POSTS
router.post("/", upload("user", "image"), userController.create);
router.post(
  "/admin/add_user/",
  upload("user", "image"),
  userController.adminCreateUser
);
router.post("/register", upload("user", "image"), userController.register);

//PUTS
router.put(
  "/:userId",
  auth("admin"),
  upload("user", "image"),
  userController.update
);

// DELETES
router.delete("/:userId", auth("admin"), userController.delete);

module.exports = router;
