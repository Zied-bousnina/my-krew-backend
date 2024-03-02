const newMission = require("../models/newMissionModel");
const cloudinary = require("../utils/uploadImage");
const ContractProcess = require("../models/contractModel.js");
const User = require("../models/userModel.js");
const preRegistrationModel = require("../models/preRegistrationModel");
const newMissionModel = require("../models/newMissionModel");
const userModel = require("../models/userModel.js");
const contractModel = require("../models/contractModel.js");
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcryptjs');
const { generateOTP,generateRandomPassword, mailTransport, generateEmailTemplate,generateDeleteAccountEmailTemplate,generateEmailTemplateCreateRHAccount,generateEmailTemplatePartner,generateEmailTemplateAffectation, plainEmailTemplate, generatePasswordResetTemplate, generateEmailTemplateDeleterAccount, generateEmailTemplateValidationAccountByAdmin, generateEmailTemplateRefusAccountByAdmin } = require("../utils/mail");
const RHvalidation = require('../validations/AddRhValidation.js');
var mailer = require('../utils/mailer');
const { sendError } = require("../utils/helper.js");
const getAllRH = async (req, res) => {
    try {
      const consultants = await userModel
        .find({ role: "RH" })


      return res.status(200).json(consultants);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  };


  const AddRH = asyncHandler(async (req, res, next) => {
    const { errors, isValid } = RHvalidation(req.body);
    console.log(req.body);

    const {
      firstName,
      lastName,
      email,
      phoneNumber
    } = req.body;

    try {
      if (!isValid) {
        return res.status(400).json(errors); // Changed status code to 400 for validation errors
      }

      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return res.status(400).json({ success: false, email: 'Email already exists' }); // Changed status code to 400 for existing user
      }

      const generatedPassword = generateRandomPassword();
      const newUser = new userModel({
        'personalInfo.firstName': firstName,
        'personalInfo.lastName': lastName,
        'personalInfo.phoneNumber': phoneNumber,
        email,
        password: bcrypt.hashSync(generatedPassword, 10),
        role: 'RH',
        CreatedByAdmin: true
      });

      const user = await newUser.save();

      // You can send an email or response here if needed
      mailer.send({
        to: ["zbousnina@yahoo.com", user.email],
        subject: "Welcome to My KREW! Your Account Details Inside",
        html: generateEmailTemplateCreateRHAccount(firstName, user.email, generatedPassword)
      }, (err) => {
        if (err) {
          console.error("Error sending email:", err);
        }
      });

      return res.status(201).json({ // Changed status code to 201 for successful resource creation
        success: true,
        user,
        msg: 'An email has been sent to your registered email address.',
      });
    } catch (error) {
      console.error("Error in AddRH:", error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  });

  const resetPassword = async (req, res) => {
    console.log(req.body)
    const { password } = req.body;
    const user = await userModel.findById(req.user.id);
    if (!user) {
      return sendError(res, "User not found");
    }

    const isSamePassword = await user.comparePassword(password);
    if (isSamePassword) {
      return sendError(res, "You cannot use the same password");
    }

    if (password.trim().length < 8 || password.trim().length > 20) {
      return sendError(res, "Password must be between 8 and 20 characters");
    }

    // user.password = password.trim();
    user.password = bcrypt.hashSync(password.trim(), 10);
    user.CreatedByAdmin = false
    await user.save();



    mailer.send(
      {
        to: ["zbousnina@yahoo.com", user.email],
        subject: "Verification code",
        html: plainEmailTemplate(
          "Password reset successfully",
          "Your password has been reset successfully!"
        ),
      },
      (err) => {}
    );

    res
      .status(200)
      .json({ message: "Password reset successfully", success: true });
  };
const ShouldChangePassword = async (req, res) => {

  try {
    const user = await userModel.findById(req.user.id
      );
    if (!user) {
      return sendError(res, "User not found");
    }
    if(user.CreatedByAdmin){
      return res.status(200).json({ shouldChangePass: true, user })
    }
    return res.status(200).json({ shouldChangePass: false, user })
  }
  catch (error) {
    console.error("Error in ShouldChangePassword:", error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

const deleteRhAccount = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id);
    if (!user) {
      return sendError(res, "User not found");
    }
    await user.remove();



  return res.status(200).json({ message: 'User deleted successfully' });




  }
  catch (error) {
    console.error("Error in deleteRhAccount:", error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }

}

  module.exports = {
    getAllRH,
    AddRH,
    resetPassword,
    ShouldChangePassword,
    deleteRhAccount

  };