const router = require("express").Router();
const passport = require("passport");
const {
  ROLES,
  isRole,
  isResetTokenValid,
} = require("../security/Rolemiddleware");

const { createMission, updateTjm, updateMissionStatus, getMissionById, getConsultantInfoById, validateProcessus, killMission } = require("../controllers/mission.controller");
const { UpdateInformationClientAndPersonalConsultantInfo, validateMissionClientInfo } = require("../controllers/preregistration.Controller");

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
router.put(
  "/validateMissionClientInfo/:id",
  validateMissionClientInfo
);
router.get(
  "/getMissionById/:id",
  getMissionById
);
router.get(
  "/getConsultantInfoById/:id",
  getConsultantInfoById
);
router
  .route("/validateProcessus/:id")
  .put(
    passport.authenticate("jwt", { session: false }),
    isRole(ROLES.CONSULTANT, ROLES.RH),
    validateProcessus
  );

  router
  .route("/killMission/:id")
  .put(
    passport.authenticate("jwt", { session: false }),
    isRole(ROLES.CONSULTANT, ROLES.RH),
    killMission
  );

module.exports = router;
