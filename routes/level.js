const router = require("express").Router();
const auth = require("../middlewares/auth");
const levelController = require("../controllers/level");

// GETS
router.get("/", auth(), levelController.getAll);
router.get("/:id", auth(), levelController.getOne);
router.get(
  "/get_levels_by_building/:buidingId",
  auth(),
  levelController.getLevelsByBuilding
);

// POSTS
router.post("/", auth(), levelController.create);

// PUTS
router.put("/:id", auth(), levelController.update);

// DELETES
router.delete("/:id", auth(), levelController.delete);

module.exports = router;
