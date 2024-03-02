const multer = require("multer");
const passport = require("passport");
const protect = require("../middleware/authMiddleware.js");
const express = require("express");
const {
  ROLES,
  isRole,
  isResetTokenValid,
} = require("../security/Rolemiddleware");
const {
  authUser,
  registerUser,
  getAllConsultant,
  getConsultantById,
  getConsultantInfoById,
  getConsultantInfoWithMissionById,
  getCurrentConsultantById,
  updateConsultantProfileImageById,
  updateConsultantCINById,
  updateConsultantRIBById,
  resetPassword,
  forgotPassword,
  getConsultantInfoWithMissionById2,
  AddVirement,
  getConsultantVirement,
} = require("../controllers/users.controller.js");
const {
  createPreRegistration1,
  createPreRegistration2,
  getPreregistration,
  getPendingPreregistration,
  getConsultantStats,
  validatePreregistrationClientInfo,
  createPreRegistration4,
  createPreRegistration3,
  validateProcessus,
  sendNote,
  getPendingMissions,
  getPreregistrationFirstMission,
} = require("../controllers/preregistration.Controller.js");
const { GetCraByMissionId, validateCRA } = require("../controllers/cra.controller.js");
const router = express.Router();
const storage = multer.diskStorage({});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb("invalid image file!", false);
  }
};
const uploads = multer({ storage, fileFilter });
//   router.route('/').post(registerUser)
router.route("/").post(registerUser);
router.route("/login").post(authUser);
router
  .route("/preRegistration/createPreRegistration1")
  .post(
    passport.authenticate("jwt", { session: false }),
    isRole(ROLES.CONSULTANT,ROLES.ADMIN),
    createPreRegistration1
  );
router
  .route("/preRegistration/createPreRegistration2")
  .post(
    passport.authenticate("jwt", { session: false }),
    isRole(ROLES.CONSULTANT,ROLES.ADMIN),
    createPreRegistration2
  );
router
  .route("/preRegistration/createPreRegistration3")
  .post(
    passport.authenticate("jwt", { session: false }),
    isRole(ROLES.CONSULTANT,ROLES.ADMIN),
    createPreRegistration3
  );
router
  .route("/preRegistration/createPreRegistration4")
  .post(
    passport.authenticate("jwt", { session: false }),
    isRole(ROLES.CONSULTANT,ROLES.ADMIN),
    createPreRegistration4
  );
router
  .route("/preRegistration/getPreregistration")
  .get(
    passport.authenticate("jwt", { session: false }),
    isRole(ROLES.CONSULTANT,ROLES.ADMIN, ROLES.RH, ROLES.ADMIN),
    getPreregistration
  );
  router
  .route("/preRegistration/getPreregistrationFirstMission")
  .get(
    passport.authenticate("jwt", { session: false }),
    isRole(ROLES.CONSULTANT,ROLES.ADMIN, ROLES.RH, ROLES.ADMIN),
    getPreregistrationFirstMission
  );
router
  .route("/consultants/getAllConsultant")
  .get(
    passport.authenticate("jwt", { session: false }),
    isRole(ROLES.CONSULTANT,ROLES.ADMIN, ROLES.RH, ROLES.ADMIN),
    getAllConsultant
  );
router
  .route("/preregistartion/getPendingPreregistration")
  .get(
    passport.authenticate("jwt", { session: false }),
    isRole(ROLES.CONSULTANT,ROLES.ADMIN, ROLES.RH, ROLES.ADMIN),
    getPendingPreregistration
  );
  router
  .route("/missions/getPendingMissions")
  .get(

    getPendingMissions
  );
router
  .route("/getConsultantStats")
  .get(
    passport.authenticate("jwt", { session: false }),
    isRole(ROLES.CONSULTANT,ROLES.ADMIN, ROLES.RH, ROLES.ADMIN),
    getConsultantStats
  );
router
  .route("/getConsultantById/:id")
  .get(
    passport.authenticate("jwt", { session: false }),
    isRole(ROLES.CONSULTANT,ROLES.ADMIN, ROLES.RH, ROLES.ADMIN),
    getConsultantById
  );
router
  .route("/getConsultantInfoById/:id")
  .get(
    passport.authenticate("jwt", { session: false }),
    isRole(ROLES.CONSULTANT,ROLES.ADMIN, ROLES.RH, ROLES.ADMIN),
    getConsultantInfoById
  );
  router
  .route("/GetCraByMissionId/:missionId")
  .get(
    passport.authenticate("jwt", { session: false }),
    isRole(ROLES.CONSULTANT,ROLES.ADMIN, ROLES.RH, ROLES.ADMIN),
    GetCraByMissionId
  );
router
  .route("/getConsultantInfoWithMissionById/:id")
  .get(
    passport.authenticate("jwt", { session: false }),
    isRole(ROLES.CONSULTANT,ROLES.ADMIN, ROLES.RH, ROLES.ADMIN),
    getConsultantInfoWithMissionById
  );
  router
  .route("/ValidateCRA/:id")
  .put(
    passport.authenticate("jwt", { session: false }),
    isRole(ROLES.CONSULTANT,ROLES.ADMIN, ROLES.RH, ROLES.ADMIN),
    validateCRA
  );
  router
  .route("/AddVirement/:id")
  .post(
    passport.authenticate("jwt", { session: false }),
    isRole(ROLES.CONSULTANT,ROLES.ADMIN, ROLES.RH, ROLES.ADMIN),
    AddVirement
  );
  router
  .route("/getConsultantInfoWithMissionById2/:id")
  .get(
    passport.authenticate("jwt", { session: false }),
    isRole(ROLES.CONSULTANT,ROLES.ADMIN, ROLES.RH, ROLES.ADMIN),
    getConsultantInfoWithMissionById2
  );
router
  .route("/validateProcessus/:id")
  .put(
    passport.authenticate("jwt", { session: false }),
    isRole(ROLES.CONSULTANT,ROLES.ADMIN, ROLES.RH, ROLES.ADMIN),
    validateProcessus
  );
router
  .route("/sendNote/:id")
  .put(
    passport.authenticate("jwt", { session: false }),
    isRole(ROLES.CONSULTANT,ROLES.ADMIN, ROLES.RH, ROLES.ADMIN),
    sendNote
  );
router
  .route("/validatePreregistrationClientInfo/:id")
  .put(
    passport.authenticate("jwt", { session: false }),
    isRole(ROLES.CONSULTANT,ROLES.ADMIN, ROLES.RH, ROLES.ADMIN),
    validatePreregistrationClientInfo
  );
router
  .route("/getCurrantConsultant")
  .get(
    passport.authenticate("jwt", { session: false }),
    isRole(ROLES.CONSULTANT,ROLES.ADMIN),
    getCurrentConsultantById
  );
router
  .route("/updateImage")
  .put(
    passport.authenticate("jwt", { session: false }),
    isRole(ROLES.CONSULTANT,ROLES.ADMIN),
    updateConsultantProfileImageById
  );
router
  .route("/updateCin")
  .put(
    passport.authenticate("jwt", { session: false }),
    isRole(ROLES.CONSULTANT,ROLES.ADMIN),
    updateConsultantCINById
  );
router
  .route("/updateRib")
  .put(
    passport.authenticate("jwt", { session: false }),
    isRole(ROLES.CONSULTANT,ROLES.ADMIN),
    updateConsultantRIBById
  );
router
  .route("/getVirements/:id")
  .get(
    passport.authenticate("jwt", { session: false }),
    isRole(ROLES.CONSULTANT,ROLES.ADMIN),
    getConsultantVirement
  );

  // Reset password
  router.post("/reset-password",isResetTokenValid,  resetPassword )
  router.route("/forgot-password").post( forgotPassword )

  router.get("/verify-token", isResetTokenValid, (req, res)=> {
    res.json({success:true})
  })


module.exports = router;
