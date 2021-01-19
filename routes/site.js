const router = require("express").Router();
const upload = require("../middlewares/multer");
const auth = require("../middlewares/auth");
const siteContoller = require("../controllers/site");

// GETS
router.get("/", auth(), siteContoller.getAll);
router.get("/:id", auth(), siteContoller.getOne);

// POSTS
router.post("/", auth(), upload("site", "logo"), siteContoller.create);

// PUTS
router.put("/:id", upload("site", "logo"), siteContoller.update);

// DELETES
router.delete("/:id", auth(), siteContoller.delete);

module.exports = router;
