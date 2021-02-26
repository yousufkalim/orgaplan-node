const router = require("express").Router();
const auth = require("../middlewares/auth");
const upload = require("../middlewares/multer");

const meanController = require("../controllers/mean");
// GETS
router.get("/", auth(), meanController.getAll);
router.get("/:id", auth(), meanController.getOne);
router.get("/get_list_of_means/:siteId", auth(), meanController.getListOfMeans);
// POSTS
router.post("/", auth(), upload("mean", "sheet"), meanController.create);
router.post("/filter", auth(), meanController.filterMeans);

// PUTS
router.put("/:id", auth(), upload("mean", "sheet"), meanController.update);
// DELETES
router.delete("/:id", meanController.delete);
module.exports = router;
