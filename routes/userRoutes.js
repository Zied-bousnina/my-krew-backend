const multer = require('multer');
const passport = require('passport');
const protect = require('../middleware/authMiddleware.js');
const express = require('express');
const { ROLES, isRole, isResetTokenValid } = require('../security/Rolemiddleware');
const { authUser, registerUser, getAllConsultant } = require('../controllers/users.controller.js');
const { createPreRegistration1, createPreRegistration2, createPreRegistration3, getPreregistration, getPendingPreregistration, getConsultantStats } = require('../controllers/preregistration.Controller.js');
const router = express.Router()
const storage = multer.diskStorage({});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
      cb(null, true);
    } else {
      cb('invalid image file!', false);
    }
  };
  const uploads = multer({ storage, fileFilter });
//   router.route('/').post(registerUser)
router.route('/').post(registerUser)
router.route('/login').post(authUser)
router.route('/preRegistration/createPreRegistration1').post(passport.authenticate('jwt', {session: false}),createPreRegistration1)
router.route('/preRegistration/createPreRegistration2').post(passport.authenticate('jwt', {session: false}),createPreRegistration2)
router.route('/preRegistration/createPreRegistration4').post(passport.authenticate('jwt', {session: false}),createPreRegistration3)
router.route('/preRegistration/getPreregistration').get(passport.authenticate('jwt', {session: false}),getPreregistration)
router.route('/consultants/getAllConsultant').get(passport.authenticate('jwt', {session: false}),getAllConsultant)
router.route('/preregistartion/getPendingPreregistration').get(getPendingPreregistration)
router.route('/getConsultantStats').get(getConsultantStats)
module.exports = router