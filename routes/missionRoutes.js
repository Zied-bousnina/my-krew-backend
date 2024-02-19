const router = require("express").Router();
const passport = require("passport");
const {
  ROLES,
  isRole,
  isResetTokenValid,
} = require("../security/Rolemiddleware");

const { createMission } = require("../controllers/mission.controller");

router.post(
  "/createMission",
  passport.authenticate("jwt", { session: false }),
  isRole(ROLES.CONSULTANT),
  createMission
);

module.exports = router;