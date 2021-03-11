const router = require("express").Router();
const auth = require("../middlewares/auth");
const upload = require("../middlewares/multer");
const companyController = require("../controllers/company");

// GETS
router.get("/", auth(), companyController.getAll);
router.get("/:id", auth(), companyController.getOne);
router.get("/user_company/:id", auth(), companyController.getUserCompany);
router.get(
  "/company_user/:siteId/:companyId",
  companyController.getCompanyUsersPerSite
);

// POSTS
// router.post("/", auth(), upload("logo"), companyController.create);
router.post("/", upload("company", "logo"), companyController.create);
router.post(
  "/add_user",
  auth(),
  upload("user", "image"),
  companyController.addUser
);

// PUTS
router.put("/:id", auth(), companyController.update);
// DELETES
router.delete("/:id", auth(), companyController.delete);

module.exports = router;
