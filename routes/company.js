const router = require("express").Router();
const auth = require("../middlewares/auth");
const upload = require("../middlewares/multer");
const companyController = require("../controllers/company");

// GETS
router.get("/", auth(), companyController.getAll);
router.get("/:id", auth(), companyController.getOne);

// POSTS
// router.post("/", auth(), upload("logo"), companyController.create);
router.post("/", auth(), upload("company", "logo"), companyController.create);

// PUTS
// router.put("/:id", auth(), upload("logo"), companyController.update);
router.put("/add_user/:id", auth(), companyController.addUser);
// DELETES
router.delete("/:id", auth(), companyController.delete);

module.exports = router;
