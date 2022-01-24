const router = require("express").Router();
const auth = require("../middlewares/auth");

const deliveryAreaController = require("../controllers/deliveryArea");

// GETS
router.get("/", deliveryAreaController.getAll);
router.get("/:id", deliveryAreaController.getOne);
router.get(
  "/delivery-area-means/:id",
  deliveryAreaController.getDeliveryAreaMeans
);

router.get(
  "/get_delivery_area_site/enterprise/:id",
  deliveryAreaController.getDelveryAreaBySiteId
);

// POSTS
router.post("/", auth(), deliveryAreaController.create);
// PUTS
router.put("/:id", deliveryAreaController.update);
// DELETES
router.delete("/:id", deliveryAreaController.delete);

module.exports = router;
