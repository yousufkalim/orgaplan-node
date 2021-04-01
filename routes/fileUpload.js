const router = require("express").Router();

const multer = require("../middlewares/multer");

router.post("/mean", multer("mean", "image", "single"), (req, res, next) => {
  res.status(200).json({ image: req.body.image });
});

module.exports = router;
