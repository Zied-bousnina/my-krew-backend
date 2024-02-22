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
  getConsultantClosestEndDateMission,
} = require("../controllers/consultant.controller");
const { createCra, craAlreadyCreatedForCurrentMonth } = require("../controllers/cra.controller");

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
router.post(
  "/createCra",
  passport.authenticate("jwt", { session: false }),
  isRole(ROLES.CONSULTANT),
  createCra
);
router.get(
  "/craAlreadyCreated/:id",
  passport.authenticate("jwt", { session: false }),
  isRole(ROLES.CONSULTANT),
  craAlreadyCreatedForCurrentMonth
);
router.get(
  "/getClosestEndDateMission/:id",
  passport.authenticate("jwt", { session: false }),
  isRole(ROLES.CONSULTANT),
  getConsultantClosestEndDateMission
);
module.exports = router;
