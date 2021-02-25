const router = require("express").Router();
const auth = require("../middlewares/auth");
const upload = require("../middlewares/multer");

const deliveryAreaController = require("../controllers/deliveryArea");
// GETS
router.get("/", auth(), deliveryAreaController.getAll);
router.get("/:id", auth(), deliveryAreaController.getOne);
router.get(
  "/get_delivery_area_means/enterprise/:id",
  auth(),
  deliveryAreaController.getDeliveryAreaMeans
);
// POSTS
router.post(
  "/",
  auth(),
  upload("deliveryArea", "document"),
  deliveryAreaController.create
);
// PUTS
router.put(
  "/:id",
  auth(),
  upload("deliveryArea", "document"),
  deliveryAreaController.update
);
// DELETES
router.delete("/:id", deliveryAreaController.delete);
module.exports = router;
