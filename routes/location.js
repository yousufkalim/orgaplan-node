const router = require("express").Router();
const auth = require("../middlewares/auth");
const locationController = require("../controllers/location");
// GETS
router.get("/", auth(), locationController.getAll);
router.get("/:id", auth(), locationController.getOne);
// POSTS
router.post("/", auth(), locationController.create);
// PUTS
router.put("/:id", locationController.update);
// DELETES
router.delete("/:id", locationController.delete);
module.exports = router;
