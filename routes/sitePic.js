const router = require("express").Router();
const auth = require("../middlewares/auth");
const sitePicController = require("../controllers/sitePic");

// GETS
router.get("/:id", auth(), sitePicController.getOne);

// POSTS
router.post("/", auth(), sitePicController.create);

// PUTS
router.put("/:id", sitePicController.update);

module.exports = router;
