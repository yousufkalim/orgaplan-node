const router = require("express").Router();
const auth = require("../middlewares/auth");
const sitePenaltiesController = require("../controllers/sitePenalties");
// GETS
router.get("/", auth(), sitePenaltiesController.getAll);
router.get("/:id", auth(), sitePenaltiesController.getOne);
// POSTS
router.post("/", auth(), sitePenaltiesController.create);
// PUTS
router.put("/:id", auth(), sitePenaltiesController.update);
router.put(
  "/penalty_company/:id",
  auth(),
  sitePenaltiesController.penaltyCompany
);

router.put("/pay_penalty/:id", auth(), sitePenaltiesController.changeStatus);

// DELETES
router.delete("/:id", auth(), sitePenaltiesController.delete);
module.exports = router;
