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
  getAllDocument,
} = require("../controllers/consultant.controller");
const { createCra, craAlreadyCreatedForCurrentMonth } = require("../controllers/cra.controller");

router.get(
  "/getAllMissions/:id",
  passport.authenticate("jwt", { session: false }),
  isRole(ROLES.CONSULTANT,ROLES.ADMIN),
  getConsultantMissions
);
router.get(
  "/getWaitingContractMissions/:id",
  getConsultantMissionsWaitingContact
);
router.get(
  "/getPendingMissions/:id",
  passport.authenticate("jwt", { session: false }),
  isRole(ROLES.CONSULTANT,ROLES.ADMIN),
  getConsultantMissionsPending
);
router.get(
  "/getValidatedMissions/:id",
  passport.authenticate("jwt", { session: false }),
  isRole(ROLES.CONSULTANT,ROLES.ADMIN),
  getConsultantMissionsValidated
);
router.get("/getNotValidatedMissions/:id", getConsultantMissionsNotValidated);
router.get(
  "/getLastMission/:id",
  passport.authenticate("jwt", { session: false }),
  isRole(ROLES.CONSULTANT,ROLES.ADMIN),
  getConsultantLastMission
);
router.post(
  "/createCra",
  passport.authenticate("jwt", { session: false }),
  isRole(ROLES.CONSULTANT,ROLES.ADMIN),
  createCra
);
router.get(
  "/craAlreadyCreated/:id",
  passport.authenticate("jwt", { session: false }),
  isRole(ROLES.CONSULTANT,ROLES.ADMIN),
  craAlreadyCreatedForCurrentMonth
);
router.get(
  "/getClosestEndDateMission/:id",
  passport.authenticate("jwt", { session: false }),
  isRole(ROLES.CONSULTANT,ROLES.ADMIN),
  getConsultantClosestEndDateMission
);
router.get(
  "/getAllDocument/:consultantId",
  passport.authenticate("jwt", { session: false }),
  isRole(ROLES.CONSULTANT,ROLES.ADMIN, ROLES.RH),
  getAllDocument
);
module.exports = router;
