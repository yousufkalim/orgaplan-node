const router = require("express").Router();
const upload = require("../middlewares/multer");
const auth = require("../middlewares/auth");
const companyController = require("../controllers/company");

// GETS
router.get("/", auth("admin"), companyController.getAll);
router.get("/:id", auth("admin"), companyController.getOne);

// POSTS
router.post("/", auth("admin"), upload("logo"), companyController.create);

// PUTS
router.put("/:id", auth("admin"), upload("logo"), companyController.update);
router.put("/add_user/:id", auth("admin"), companyController.addUser);
// DELETES
router.delete("/:id", auth("admin"), companyController.delete);

module.exports = router;
