const router = require("express").Router();
const upload = require("../middlewares/multer");

const meanController = require("../controllers/mean");
// GETS
router.get("/", meanController.getAll);
router.get("/get/:id", meanController.getOne);
router.get("/get_site_means/:siteId", meanController.getAllBySite);
router.get("/get_list_of_means/:siteId", meanController.getListOfMeans);

router.get("/get_add_mean/:siteId", meanController.getAddMean);
router.get("/get_exterior_means/:siteId", meanController.getExternalMeans);

// POSTS
router.post(
  "/",
  upload(
    "mean",
    [
      { name: "sheet", maxCount: 1 },
      { name: "image", maxCount: 1 },
    ],
    "fields"
  ),
  meanController.create
);
router.post("/filter", meanController.filterMeans);

// PUTS
router.put(
  "/:id",
  upload(
    "mean",
    [
      { name: "sheet", maxCount: 1 },
      { name: "image", maxCount: 1 },
    ],
    "fields"
  ),
  meanController.update
);

// DELETES
router.delete("/:id", meanController.delete);

module.exports = router;
