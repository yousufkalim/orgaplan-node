const router = require("express").Router();
const auth = require("../middlewares/auth");
const levelController = require("../controllers/level");

// GETS
router.get("/", levelController.getAll);
router.get("/:id", levelController.getOne);
router.get(
  "/get_levels_by_building/:buidingId",

  levelController.getLevelsByBuilding
);

// POSTS
router.post("/", levelController.create);

// PUTS
router.put("/:id", levelController.update);

// DELETES
router.delete("/:id", levelController.delete);

module.exports = router;
