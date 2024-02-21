const router = require("express").Router();
const passport = require("passport");
const {
  ROLES,
  isRole,
  isResetTokenValid,
} = require("../security/Rolemiddleware");

const { createMission, updateTjm, updateMissionStatus } = require("../controllers/mission.controller");
const { UpdateInformationClientAndPersonalConsultantInfo } = require("../controllers/preregistration.Controller");

router.post(
  "/createMission",
  passport.authenticate("jwt", { session: false }),
  isRole(ROLES.CONSULTANT),
  createMission
);
router.put(
  "/updateTjm/:id",
  passport.authenticate("jwt", { session: false }),
  isRole(ROLES.CONSULTANT),
  updateTjm
);
router.put(
  "/UpdateInformationClientAndPersonalConsultantInfo/:id",
  passport.authenticate("jwt", { session: false }),
  isRole(ROLES.CONSULTANT),
  UpdateInformationClientAndPersonalConsultantInfo
);

router.put(
  "/updateMissionStatus/:id",
  updateMissionStatus
);


module.exports = router;
