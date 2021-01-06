const router = require("express").Router();
const upload = require("../middlewares/multer");
const auth = require("../middlewares/auth");
const userSitesController = require("../controllers/userSites");

// GETS
router.get("/", auth("admin"), userSitesController.getAll);
router.get("/:id", auth("admin"), userSitesController.getOne);

// POSTS
router.post("/", upload("logo"), userSitesController.create);

// PUTS
router.put("/:id", upload("logo"), userSitesController.update);

// DELETES
router.delete("/:id", auth("admin"), userSitesController.delete);

module.exports = router;
