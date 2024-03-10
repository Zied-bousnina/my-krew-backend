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

} = require("../controllers/users.controller.js");
const {

} = require("../controllers/preregistration.Controller.js");
const { GetCraByMissionId, validateCRA } = require("../controllers/cra.controller.js");
const { getAllRH, AddRH, resetPassword, ShouldChangePassword, deleteRhAccount } = require("../controllers/admin.controller.js");
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
router
  .route("/Rh/getALlRhUsers")
  .get(
    passport.authenticate("jwt", { session: false }),
    isRole(ROLES.ADMIN),
    getAllRH
  );

  router
  .route("/Rh/AddRH")
  .post(
    passport.authenticate("jwt", { session: false }),
    isRole(ROLES.ADMIN),
    AddRH
  );

  router.post("/RH/reset-password",  passport.authenticate("jwt", { session: false }),  resetPassword )
  router.delete("/RH/deleteRhAccount/:id",  passport.authenticate("jwt", { session: false }),  deleteRhAccount )
  router.get("/RH/ShouldChangePassword",  passport.authenticate("jwt", { session: false }),  ShouldChangePassword )


  module.exports = router;