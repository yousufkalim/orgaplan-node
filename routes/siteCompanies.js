const router = require("express").Router();
const auth = require("../middlewares/auth");
const siteCompanyController = require("../controllers/siteCompanies");

// GETS
router.get("/", auth(), siteCompanyController.getAll);
router.get("/:siteId", auth(), siteCompanyController.getOne);

// POSTS
router.post("/", auth(), siteCompanyController.create);
router.post("/filter", siteCompanyController.filterCompanies);

// PUTS
router.put("/:id", auth(), siteCompanyController.update);
router.put("/add_user/:id", auth(), siteCompanyController.addUser);
// DELETES
router.delete("/:id", auth(), siteCompanyController.delete);
router.delete(
  "/delete-company/:siteId",
  auth(),
  siteCompanyController.deleteSiteCompanies
);

module.exports = router;
