const router = require("express").Router();
const auth = require("../middlewares/auth");
const upload = require("../middlewares/multer");
const incidentsController = require("../controllers/incidents");
const multer = require("../middlewares/multer");

// GETS
router.get("/", incidentsController.getAll);
router.get("/:id", auth(), incidentsController.getOne);

router.get("/admin/:id", incidentsController.getIncidentAdmin);
router.get(
  "/admin/incident_list/:id",

  incidentsController.getIncidentList
);

// POSTS
// router.post("/", auth(), upload("logo"), companyController.create);
router.post(
  "/",
  multer("incidents", "photos", "single"),
  incidentsController.create
);

// PUTS
router.put(
  "/:id",
  multer("incidents", "photos", "single"),
  incidentsController.update
);
// DELETES
router.delete("/:id", auth(), incidentsController.delete);

router.post("/filter", incidentsController.filterIncidents);

module.exports = router;
