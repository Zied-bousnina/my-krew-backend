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
} = require("../controllers/preregistration.Controller.js");
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
    isRole(ROLES.CONSULTANT),
    createPreRegistration1
  );
router
  .route("/preRegistration/createPreRegistration2")
  .post(
    passport.authenticate("jwt", { session: false }),
    isRole(ROLES.CONSULTANT),
    createPreRegistration2
  );
router
  .route("/preRegistration/createPreRegistration3")
  .post(
    passport.authenticate("jwt", { session: false }),
    isRole(ROLES.CONSULTANT),
    createPreRegistration3
  );
router
  .route("/preRegistration/createPreRegistration4")
  .post(
    passport.authenticate("jwt", { session: false }),
    isRole(ROLES.CONSULTANT),
    createPreRegistration4
  );
router
  .route("/preRegistration/getPreregistration")
  .get(
    passport.authenticate("jwt", { session: false }),
    isRole(ROLES.CONSULTANT, ROLES.RH),
    getPreregistration
  );
router
  .route("/consultants/getAllConsultant")
  .get(
    passport.authenticate("jwt", { session: false }),
    isRole(ROLES.CONSULTANT, ROLES.RH),
    getAllConsultant
  );
router
  .route("/preregistartion/getPendingPreregistration")
  .get(
    passport.authenticate("jwt", { session: false }),
    isRole(ROLES.CONSULTANT, ROLES.RH),
    getPendingPreregistration
  );
router
  .route("/getConsultantStats")
  .get(
    passport.authenticate("jwt", { session: false }),
    isRole(ROLES.CONSULTANT, ROLES.RH),
    getConsultantStats
  );
router
  .route("/getConsultantById/:id")
  .get(
    passport.authenticate("jwt", { session: false }),
    isRole(ROLES.CONSULTANT, ROLES.RH),
    getConsultantById
  );
router
  .route("/getConsultantInfoById/:id")
  .get(
    passport.authenticate("jwt", { session: false }),
    isRole(ROLES.CONSULTANT, ROLES.RH),
    getConsultantInfoById
  );
router
  .route("/getConsultantInfoWithMissionById/:id")
  .get(
    passport.authenticate("jwt", { session: false }),
    isRole(ROLES.CONSULTANT, ROLES.RH),
    getConsultantInfoWithMissionById
  );
router
  .route("/validateProcessus/:id")
  .put(
    passport.authenticate("jwt", { session: false }),
    isRole(ROLES.CONSULTANT, ROLES.RH),
    validateProcessus
  );
router
  .route("/sendNote/:id")
  .put(
    passport.authenticate("jwt", { session: false }),
    isRole(ROLES.CONSULTANT, ROLES.RH),
    sendNote
  );
router
  .route("/validatePreregistrationClientInfo/:id")
  .put(
    passport.authenticate("jwt", { session: false }),
    isRole(ROLES.CONSULTANT, ROLES.RH),
    validatePreregistrationClientInfo
  );
router
  .route("/getCurrantConsultant")
  .get(
    passport.authenticate("jwt", { session: false }),
    isRole(ROLES.CONSULTANT),
    getCurrentConsultantById
  );
router
  .route("/updateImage")
  .put(
    passport.authenticate("jwt", { session: false }),
    isRole(ROLES.CONSULTANT),
    updateConsultantProfileImageById
  );
router
  .route("/updateCin")
  .put(
    passport.authenticate("jwt", { session: false }),
    isRole(ROLES.CONSULTANT),
    updateConsultantCINById
  );
router
  .route("/updateRib")
  .put(
    passport.authenticate("jwt", { session: false }),
    isRole(ROLES.CONSULTANT),
    updateConsultantRIBById
  );

  // Reset password
  router.post("/reset-password",isResetTokenValid,  resetPassword )
  router.route("/forgot-password").post( forgotPassword )

  router.get("/verify-token", isResetTokenValid, (req, res)=> {
    res.json({success:true})
  })


module.exports = router;
