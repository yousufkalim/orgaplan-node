const router = require("express").Router();
const auth = require("../middlewares/auth");
const siteIncidentsController = require("../controllers/siteIncidents");
// GETS
router.get("/", auth(), siteIncidentsController.getAll);
router.get("/:id", auth(), siteIncidentsController.getOne);
// POSTS
router.post("/", auth(), siteIncidentsController.create);
// PUTS
router.put("/:id", siteIncidentsController.update);
// DELETES
router.delete("/:id", siteIncidentsController.delete);
module.exports = router;
