const router = require("express").Router();

const auth = require("../../middlewares/auth");
const superAdminClientsController = require("../../controllers/SuperAdmin");
const multer = require("../../middlewares/multer");

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
router.put("/:id", superAdminClientsController.clientsController.update);

// DELETES
router.delete("/:id", superAdminClientsController.clientsController.delete);

module.exports = router;
