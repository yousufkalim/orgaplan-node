const router = require("express").Router();

const auth = require("../middlewares/auth");
const authController = require("../controllers/auth");

router.get("/get-profile-by-jwt", auth(), authController.getProfile);

router.post("/sign-up", authController.signup);
router.post("/sign-in", authController.signin);
router.post(
  "/request-email-verification",
  authController.RequestEmailVerification
);
router.post("/verify-email", authController.VerifyEmail);
router.post("/request-password-reset", authController.RequestPasswordReset);
router.post("/reset-password", authController.resetPassword);
router.put("/update-password/:userId", authController.updatePassword);
module.exports = router;
