const router = require("express").Router();
const passport = require("passport");
const {
  ROLES,
  isRole,
  isResetTokenValid,
} = require("../security/Rolemiddleware");

const {
  getConsultantMissions,
  getConsultantMissionsPending,
  getConsultantMissionsValidated,
  getConsultantMissionsNotValidated,
  getConsultantMissionsWaitingContact,
  getConsultantLastMission,
} = require("../controllers/consultant.controller");

router.get(
  "/getAllMissions/:id",
  passport.authenticate("jwt", { session: false }),
  isRole(ROLES.CONSULTANT),
  getConsultantMissions
);
router.get(
  "/getWaitingContractMissions/:id",
  getConsultantMissionsWaitingContact
);
router.get(
  "/getPendingMissions/:id",
  passport.authenticate("jwt", { session: false }),
  isRole(ROLES.CONSULTANT),
  getConsultantMissionsPending
);
router.get(
  "/getValidatedMissions/:id",
  passport.authenticate("jwt", { session: false }),
  isRole(ROLES.CONSULTANT),
  getConsultantMissionsValidated
);
router.get("/getNotValidatedMissions/:id", getConsultantMissionsNotValidated);
router.get(
  "/getLastMission/:id",
  passport.authenticate("jwt", { session: false }),
  isRole(ROLES.CONSULTANT),
  getConsultantLastMission
);
module.exports = router;
