import express from "express";

const router = express.Router();
const authController = require("../controllers/authController");
const educationController = require("../controllers/educationController");

router
  .route("/")
  .get(
    authController.verifyUser,
    authController.checkRole(["normal", "admin"]),
    educationController.getAllEducation
  );

router
  .route("/resume/:id")
  .get(
    authController.verifyUser,
    authController.checkRole(["normal", "admin"]),
    educationController.getAllEducationSpecifcResume
  );

router
  .route("/:id")
  .get(
    authController.verifyUser,
    authController.checkRole(["normal", "admin"]),
    educationController.getSpecificEducation
  )
  .delete(
    authController.verifyUser,
    authController.checkRole(["normal", "admin"]),
    educationController.deleteEducation
  )
  .post(
    authController.verifyUser,
    authController.checkRole(["normal", "admin"]),
    educationController.createEducation
  );

module.exports = router;
