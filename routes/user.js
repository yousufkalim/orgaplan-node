const router = require("express").Router();

const auth = require("../middlewares/auth");
const upload = require("../middlewares/multer");
const userController = require("../controllers/user");

// GETS
router.get("/", userController.getAll);
router.get("/:userId", userController.getOne);
router.get("/add_user/:siteId/:adminId", userController.getAddUser);
router.get("/get_user_company/:siteId/:userId", userController.getUserCompany);
router.get("/get_user_company/:siteId/:userId", userController.getUserCompany);

//getUserCompany
//POSTS
router.post("/filter", userController.userFilter);

router.post("/", upload("user", "image"), userController.create);
router.post(
  "/admin/add_user/",
  upload("user", "image"),
  userController.adminCreateUser
);
router.post("/register", upload("user", "image"), userController.register);
router.post(
  "/add_company_user",
  upload("user", "image"),
  userController.createCompanyUser
);

router.put(
  "/update_company_user",
  userController.updateCompanyUser
);

//PUTS
router.put(
  "/:userId",
  auth("admin"),
  upload("user", "image"),
  userController.update
);
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
