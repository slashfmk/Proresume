import express from "express";

const router = express.Router();
const authController = require("../controllers/authController");

router.route("/signin").post(authController.signIn);

router.route("/signup").post(authController.signUp);

module.exports = router;
