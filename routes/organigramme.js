const router = require("express").Router();

const auth = require("../middlewares/auth");
const upload = require("../middlewares/multer");
const organigrammeController = require("../controllers/organigramme");

// GETS
router.get("/", auth("admin"), organigrammeController.getAll);
router.get("/:id", organigrammeController.getOne);

router.get("/site/:siteId", organigrammeController.getBySiteId);

//POSTS
router.post(
  "/",
  upload("organigramme", "image"),
  organigrammeController.create
);

//PUTS
router.put(
  "/:id",

  upload("organigramme", "image"),
  organigrammeController.update
);

// DELETES
router.delete("/:id", auth("admin"), organigrammeController.delete);

module.exports = router;
