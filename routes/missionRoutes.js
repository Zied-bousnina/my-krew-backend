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
  isRole(ROLES.CONSULTANT,ROLES.ADMIN),
  createMission
);
router.put(
  "/updateTjm/:id",
  passport.authenticate("jwt", { session: false }),
  isRole(ROLES.CONSULTANT,ROLES.ADMIN),
  updateTjm
);
router.put(
  "/UpdateInformationClientAndPersonalConsultantInfo/:id",
  passport.authenticate("jwt", { session: false }),
  isRole(ROLES.CONSULTANT,ROLES.ADMIN),
  UpdateInformationClientAndPersonalConsultantInfo
);

router.put(
  "/updateMissionStatus/:id",
  passport.authenticate("jwt", { session: false }),
  isRole(ROLES.CONSULTANT,ROLES.ADMIN, ROLES.RH),
  updateMissionStatus
);
router.put(
  "/validateMissionClientInfo/:id",
  passport.authenticate("jwt", { session: false }),
  isRole(ROLES.CONSULTANT,ROLES.ADMIN, ROLES.RH),
  validateMissionClientInfo
);
router.get(
  "/getMissionById/:id",
  passport.authenticate("jwt", { session: false }),
  isRole(ROLES.CONSULTANT,ROLES.ADMIN, ROLES.RH),
  getMissionById
);
router.get(
  "/getConsultantInfoById/:id",
  passport.authenticate("jwt", { session: false }),
  isRole(ROLES.CONSULTANT,ROLES.ADMIN, ROLES.RH),
  getConsultantInfoById
);
router
  .route("/validateProcessus/:id")
  .put(
    passport.authenticate("jwt", { session: false }),
    isRole(ROLES.CONSULTANT,ROLES.ADMIN, ROLES.RH),
    validateProcessus
  );

  router
  .route("/killMission/:id")
  .put(
    passport.authenticate("jwt", { session: false }),
    isRole(ROLES.CONSULTANT,ROLES.ADMIN, ROLES.RH),
    killMission
  );

module.exports = router;
