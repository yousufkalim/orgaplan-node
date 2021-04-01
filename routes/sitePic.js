const router = require("express").Router();
const auth = require("../middlewares/auth");
const sitePicController = require("../controllers/sitePic");

// GETS
router.get("/get/:id", sitePicController.getOne);
router.get("/site/:siteId", sitePicController.getBySite);

// POSTS
router.post("/", sitePicController.create);
router.post("/shape", sitePicController.addShape);

// PUTS
router.put("/update/:id", sitePicController.update);
router.put("/shape/:picId/:shapeId", sitePicController.updateShape);

// DELETE
router.delete("/shape/:picId/:shapeId", sitePicController.deleteShape);

module.exports = router;
