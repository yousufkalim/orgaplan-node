const router = require("express").Router();
const auth = require("../middlewares/auth");
const siteCompanyController = require("../controllers/siteCompanies");

// GETS
router.get("/", auth(), siteCompanyController.getAll);
router.get("/:siteId", auth(), siteCompanyController.getOne);

// POSTS
router.post("/", siteCompanyController.create);
router.post("/filter", siteCompanyController.filterCompanies);
router.post("/add_companies", siteCompanyController.addCompanies);

// PUTS
router.put("/:id", siteCompanyController.update);
router.put("/add_user/:id", siteCompanyController.addUser);

// DELETES
router.delete("/:id", auth(), siteCompanyController.delete);
router.delete(
  "/delete-company/:siteId",
  auth(),
  siteCompanyController.deleteSiteCompanies
);

module.exports = router;
