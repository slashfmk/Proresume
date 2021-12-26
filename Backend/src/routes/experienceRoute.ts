import express from "express";

const router = express.Router();
const authController = require("../controllers/authController");
const experienceController = require("../controllers/experienceController");

router
  .route("/")
  .get(
    authController.verifyUser,
    authController.checkRole(["normal", "admin"]),
    experienceController.getAllExperience
  );

router
  .route("/resume/:id")
  .get(
    authController.verifyUser,
    authController.checkRole(["normal", "admin"]),
    experienceController.getAllExperienceSpecifcResume
  );

router
  .route("/:id")
  .get(
    authController.verifyUser,
    authController.checkRole(["normal", "admin"]),
    experienceController.getSpecificExperience
  )
  .delete(
    authController.verifyUser,
    authController.checkRole(["normal", "admin"]),
    experienceController.deleteExperience
  )
  .post(
    authController.verifyUser,
    authController.checkRole(["normal", "admin"]),
    experienceController.createExperience
  );

module.exports = router;
