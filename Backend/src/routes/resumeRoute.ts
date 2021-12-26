import express from "express";

const router = express.Router();
const authController = require("../controllers/authController");

const resumeController = require("../controllers/resumeController");

router
  .route("/")
  .get(
    authController.verifyUser,
    authController.checkRole(["normal", "admin"]),
    resumeController.getAllResume
  )
  .post(
    authController.verifyUser,
    authController.checkRole(["normal", "admin"]),
    resumeController.createResume
  );

router
  .route("/:id")
  .get(
    authController.verifyUser,
    authController.checkRole(["normal", "admin"]),
    resumeController.getSpecificResume
  )
  .delete(
    authController.verifyUser,
    authController.checkRole(["normal", "admin"]),
    resumeController.deleteResume
  );

module.exports = router;
