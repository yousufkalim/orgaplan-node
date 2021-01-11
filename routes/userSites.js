const router = require("express").Router();
const upload = require("../middlewares/multer");
const auth = require("../middlewares/auth");
const userSitesController = require("../controllers/userSites");

// GETS
router.get("/", auth(), userSitesController.getAll);
router.get("/:id", auth(), userSitesController.getOne);
router.get("/single/:userId", auth(), userSitesController.getSiteByUserId);

// POSTS
// router.post("/", auth(), upload("logo"), userSitesController.create);

// PUTS
// router.put("/:id", auth(), upload("logo"), userSitesController.update);

// DELETES
router.delete("/:id", auth(), userSitesController.delete);
router.delete(
  "/delete-user-site/:userId",
  auth(),
  userSitesController.deleteUserSite
);

module.exports = router;
