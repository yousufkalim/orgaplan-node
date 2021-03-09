const router = require("express").Router();
const auth = require("../middlewares/auth");
const storageAreaController = require("../controllers/storageArea");
// GETS
router.get("/", auth(), storageAreaController.getAll);
router.get("/:id", auth(), storageAreaController.getOne);
router.get(
  "/get_by_level_id_copany_id/enterprise/:level_id/:company_id",
  auth(),
  storageAreaController.getByLevelIdAndCompany
);
router.get(
  "/get_by_level_id/enterprise/:level_id/",
  auth(),
  storageAreaController.getByLevelId
);
router.get(
  "/get_by_company_id/enterprise/:company_id",
  auth(),
  storageAreaController.getByCompanyId
);
router.get(
  "/get_storage_means/enterprise/:id",
  auth(),
  storageAreaController.getStorageMeans
);
router.get(
  "/get_storage_site/enterprise/:id",
  auth(),
  storageAreaController.getStorageAreaBySiteId
);
router.get(
  "/get_exterior_means/enterprise/:siteId",
  auth(),
  storageAreaController.getExteriorMeans
);
// POSTS
router.post("/", auth(), storageAreaController.create);
// PUTS
router.put("/:id", storageAreaController.update);
// DELETES
router.delete("/:id", storageAreaController.delete);
module.exports = router;
