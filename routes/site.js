const router = require("express").Router();
const upload = require("../middlewares/multer");
const auth = require("../middlewares/auth");
const siteContoller = require("../controllers/site");

// GETS
router.get("/", auth("admin"), siteContoller.getAll);
router.get("/:id", auth("admin"), siteContoller.getOne);

// POSTS
router.post("/", auth("admin"), upload("logo"), siteContoller.create);

// PUTS
router.put("/:id", auth("admin"), upload("logo"), siteContoller.update);

// DELETES
router.delete("/:id", auth("admin"), siteContoller.delete);

module.exports = router;
