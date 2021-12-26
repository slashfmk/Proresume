import express from "express";

const router = express.Router();
const authController = require("../controllers/authController");
const skillController = require("../controllers/skillController");

router
  .route("/")
  .get(
    authController.verifyUser,
    authController.checkRole(["normal", "admin"]),
    skillController.getAllSkill
  );
router
  .route("/resume/:id")
  .get(
    authController.verifyUser,
    authController.checkRole(["normal", "admin"]),
    skillController.getAllSkillSpecifcResume
  );

router
  .route("/:id")
  .get(
    authController.verifyUser,
    authController.checkRole(["normal", "admin"]),
    skillController.getSpecificSkill
  )
  .delete(
    authController.verifyUser,
    authController.checkRole(["normal", "admin"]),
    skillController.deleteSkill
  )
  .post(
    authController.verifyUser,
    authController.checkRole(["normal", "admin"]),
    skillController.createSkill
  );

module.exports = router;
