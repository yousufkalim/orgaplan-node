const router = require("express").Router();

const auth = require("../../middlewares/auth");
const multer = require("../../middlewares/multer");
const superAdminClientsController = require("../../controllers/SuperAdmin");

// GETS
router.get("/", superAdminClientsController.clientsController.getAll);
router.get("/:id", superAdminClientsController.clientsController.getById);

// POSTS
router.post(
  "/",
  multer("company", "logo", "single"),
  superAdminClientsController.clientsController.create
);

// PUTS
router.put(
  "/",
  multer("company", "logo", "single"),
  superAdminClientsController.clientsController.update
);
router.put(
  "/verify/:clientId/:contractId",
  superAdminClientsController.clientsController.verifyRequest
);

// DELETES
router.delete("/", superAdminClientsController.clientsController.delete);

module.exports = router;
