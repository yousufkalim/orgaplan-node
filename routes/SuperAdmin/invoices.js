const router = require("express").Router();

const auth = require("../../middlewares/auth");
const superAdmin = require("../../controllers/SuperAdmin");

// GETS
router.get("/", superAdmin.invoicesController.getAll);
router.get("/get/:id", superAdmin.invoicesController.getById);
router.get("/client/:clientId", superAdmin.invoicesController.getAllByClient);

// POSTS
router.post("/", superAdmin.invoicesController.create);

// PUTS
router.put("/", superAdmin.invoicesController.update);

// DELETES
router.delete("/delete/:id", superAdmin.invoicesController.delete);

module.exports = router;
