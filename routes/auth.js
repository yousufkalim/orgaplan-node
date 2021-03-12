const router = require("express").Router();
const STRINGS = require("../utils/texts");

const auth = require("../middlewares/auth");
const multer = require("../middlewares/multer");
const authController = require("../controllers/auth");

// Gets
router.get(
  "/get-profile-by-jwt",
  auth(STRINGS.ROLES.ALL),
  authController.getProfile
);
router.get("/validate-token/:userId/:token", authController.validateToken);

// Posts
router.post(
  "/sign-up",
  multer("user", "image", "single"),
  authController.registerUser
);
router.post("/sign-in", authController.signin);
router.post(
  "/request-email-verification",
  authController.RequestEmailVerification
);
router.post("/verify-email", authController.VerifyEmail);
router.post("/request-password-reset", authController.RequestPasswordReset);
router.post("/reset-password", authController.resetPassword);

// Puts
router.put("/update-password/:userId", authController.updatePassword);

module.exports = router;
