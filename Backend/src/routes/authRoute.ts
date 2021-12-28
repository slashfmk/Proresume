import express from "express";

const router = express.Router();
const authController = require("../controllers/authController");

router.route("/signin").post(authController.signIn)
router.route("/signup").post(authController.signUp)
router.route("/token").post(authController.refreshTokenSignIn)
router.route("/logout").delete(authController.logoutSpecificDevice);
router.route("/logout-all").delete(authController.logoutAllDevices);

module.exports = router;
