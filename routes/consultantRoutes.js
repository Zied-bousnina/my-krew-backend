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
} = require("../controllers/consultant.controller");

router.get("/getAllMissions/:id", getConsultantMissions);
router.get(
  "/getWaitingContractMissions/:id",
  getConsultantMissionsWaitingContact
);
router.get("/getPendingMissions/:id", getConsultantMissionsPending);
router.get("/getValidatedMissions/:id", getConsultantMissionsValidated);
router.get("/getNotValidatedMissions/:id", getConsultantMissionsNotValidated);
module.exports = router;
