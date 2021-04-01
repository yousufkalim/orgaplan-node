const router = require("express").Router();
const auth = require("../middlewares/auth");
const upload = require("../middlewares/multer");
const incidentsController = require("../controllers/incidents");

// GETS
router.get("/", incidentsController.getAll);
router.get("/:id", auth(), incidentsController.getOne);

router.get("/admin/:id", incidentsController.getIncidentAdmin);
router.get(
  "/admin/incident_list/:id",

  incidentsController.getIncidentList
);
router.get(
  "/enterprise/incident_list/:id",
  incidentsController.getEnterpriseIncidentList
);
// POSTS
// router.post("/", auth(), upload("logo"), companyController.create);
router.post(
  "/",

  upload(
    "incidents",

    [
      { name: "photos", maxCount: 3 },
      { name: "document", maxCount: 1 },
    ],
    "fields"
  ),
  //  upload("incidents", "document"),
  incidentsController.create
);

router.post(
  "/enterprise",
  upload(
    "incidents",
    [
      { name: "photos", maxCount: 3 },
      { name: "document", maxCount: 1 },
    ],
    "fields"
  ),
  incidentsController.createEnterpriseIncidents
);

// PUTS
router.put(
  "/:id",
  upload(
    "incidents",

    [
      { name: "photos", maxCount: 3 },
      { name: "document", maxCount: 1 },
    ],
    "fields"
  ),
  incidentsController.update
);
// DELETES
router.delete("/:id", auth(), incidentsController.delete);

router.post("/filter", incidentsController.filterIncidents);

module.exports = router;
