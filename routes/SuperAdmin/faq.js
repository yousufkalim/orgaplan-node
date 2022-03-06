const router = require("express").Router();

const auth = require("../../middlewares/auth");
const multer = require("../../middlewares/multer");
const superAdmin = require("../../controllers/SuperAdmin");

// GETS
router.get("/", superAdmin.faqController.getAllQuestions);
router.get("/:id", superAdmin.faqController.getQuestionById);

// POSTS
router.post(
  "/",
  auth("SUPERADMIN"),
  multer("faq", "picture"),
  superAdmin.faqController.createQuestion);

router.post(
  "/:id/steps",
  auth("SUPERADMIN"),
  multer("faq", "picture"),
  superAdmin.faqController.addStep);

// PUTS
router.put(
  "/:id",
  auth("SUPERADMIN"),
  superAdmin.faqController.updateQuestion);

router.put(
  "/:id/steps/:stepId",
  auth("SUPERADMIN"),
  multer("faq", "picture"),
  superAdmin.faqController.updateStep);

// DELETES
router.delete(
    "/:id",
    auth("SUPERADMIN"),
    superAdmin.faqController.deleteQuestionById);

router.delete(
    "/:id/steps/:stepId",
    auth("SUPERADMIN"),
    superAdmin.faqController.deleteStepById);

module.exports = router;
