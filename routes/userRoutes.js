const multer = require('multer');
const passport = require('passport');
const protect = require('../middleware/authMiddleware.js');
const express = require('express');
const { ROLES, isRole, isResetTokenValid } = require('../security/Rolemiddleware');
const { authUser, registerUser, getAllConsultant, getConsultantById } = require('../controllers/users.controller.js');
const { createPreRegistration1, createPreRegistration2, getPreregistration, getPendingPreregistration, getConsultantStats, validatePreregistrationClientInfo, createPreRegistration4, createPreRegistration3 } = require('../controllers/preregistration.Controller.js');
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
router.route('/preRegistration/createPreRegistration1').post(passport.authenticate('jwt', {session: false}), isRole(ROLES.CONSULTANT),createPreRegistration1)
router.route('/preRegistration/createPreRegistration2').post(passport.authenticate('jwt', {session: false}),isRole(ROLES.CONSULTANT),createPreRegistration2)
router.route('/preRegistration/createPreRegistration3').post(passport.authenticate('jwt', {session: false}),isRole(ROLES.CONSULTANT),createPreRegistration3)
router.route('/preRegistration/createPreRegistration4').post(passport.authenticate('jwt', {session: false}),isRole(ROLES.CONSULTANT),createPreRegistration4)
router.route('/preRegistration/getPreregistration').get(passport.authenticate('jwt', {session: false}),isRole(ROLES.CONSULTANT, ROLES.RH),getPreregistration)
router.route('/consultants/getAllConsultant').get(passport.authenticate('jwt', {session: false}),isRole(  ROLES.CONSULTANT,ROLES.RH),getAllConsultant)
router.route('/preregistartion/getPendingPreregistration').get(passport.authenticate('jwt', {session: false}),isRole(ROLES.CONSULTANT, ROLES.RH),getPendingPreregistration)
router.route('/getConsultantStats').get(passport.authenticate('jwt', {session: false}),isRole(ROLES.CONSULTANT,ROLES.RH),getConsultantStats)
router.route('/getConsultantById/:id').get(passport.authenticate('jwt', {session: false}),isRole(ROLES.CONSULTANT, ROLES.RH),getConsultantById)
router.route('/validatePreregistrationClientInfo/:id').put(passport.authenticate('jwt', {session: false}),isRole( ROLES.CONSULTANT,ROLES.RH),validatePreregistrationClientInfo)
module.exports = router