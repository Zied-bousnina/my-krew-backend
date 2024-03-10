const userModel = require("../models/userModel");
const Preregister = require("../models/preRegistrationModel");
const validateLoginInput = require("../validations/login");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validateRegisterInput = require("../validations/validateRegisterInput");
const preRegistrationModel = require("../models/preRegistrationModel");
const newMissionModel = require("../models/newMissionModel");
const cloudinary = require("../utils/uploadImage");
const resetTokenModels = require("../models/resetToken.models");
const changePasswordValidation = require("../validations/ChangePasswordValidation.js");
const { sendError, createRandomBytes } = require("../utils/helper");
const Log = require('../models/Log.model.js'); // Assuming your Log model is named log.js

const {
  generateOTP,
  generateRandomPassword,
  mailTransport,
  generateEmailTemplate,
  generateDeleteAccountEmailTemplate,
  generateEmailTemplateDriver,
  generateEmailTemplatePartner,
  generateEmailTemplateAffectation,
  plainEmailTemplate,
  generatePasswordResetTemplate,
  generateEmailTemplateDeleterAccount,
  generateEmailTemplateValidationAccountByAdmin,
  generateEmailTemplateRefusAccountByAdmin,
} = require("../utils/mail");
var mailer = require("../utils/mailer");
const virementModel = require("../models/virementModel.js");
const LogModel = require("../models/Log.model.js");
const UserDocument = require("../models/userDocumentModel.js");
const authUser = async (req, res) => {
  try {
    const { errors, isValid } = validateLoginInput(req.body);

    if (!isValid) {
      return res.status(404).json(errors);
    }

    const user = await userModel.findOne({ email: req.body.email });

    if (user && user.googleId) {
      errors.email =
        "Cannot login with email and password. Please use Google Sign In.";
      return res.status(400).json(errors);
    }

    if (!user) {
      errors.email = "Email not found";
      return res.status(404).json(errors);
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    const preRegistration = await Preregister.find({
      userId: user._id,
    }).populate("contractProcess");
    console.log("++++++++++++++++++++++", preRegistration);
    const firstMission = await newMissionModel
      .findOne({ userId: user._id })
      .sort({ createdAt: 1 });

    if (isMatch) {
      const token = jwt.sign(
        {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          verified: user.verified,
          profile: user.profile,
          isBlocked: user.isBlocked,
          onligne: user.onligne,
          firstLogin: user.firstLogin,
          driverIsVerified: user.driverIsVerified,
          preRegister: preRegistration,
          firstMission: firstMission,
          isBlocked:user?.isBlocked,
          CreatedByAdmin:user?.CreatedByAdmin
        },
        process.env.SECRET_KEY,
        { expiresIn: Number.MAX_SAFE_INTEGER }
      );

      return res
        .header("auth-token", token)
        .status(200)
        .json({
          status: true,
          token: "Bearer " + token,
          role: user.role,
          id: user._id,
          preRegistration: preRegistration,
          status: preRegistration?.status,
        });
    } else {
      errors.password = "Password incorrect";
      return res.status(404).json(errors);
    }
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

const registerUser = async (req, res) => {
  try {
    const { errors, isValid } = validateRegisterInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    const user = await userModel.findOne({ email: req.body.email });

    if (user) {
      errors.email = "Email already exists";
      return res.status(400).json(errors);
    }

    const newUser = new userModel({
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 10),
    });
    const preRegistration = new preRegistrationModel({ userId: newUser._id });
    await preRegistration.save();

    newUser.preRegister = preRegistration._id;

    const savedUser = await newUser.save();
    return res.status(200).json(savedUser);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAllConsultant = async (req, res) => {
  try {
    const consultants = await userModel
      .find({ role: "CONSULTANT" })
      .populate("preRegister");

    return res.status(200).json(consultants);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const getConsultantById = async (req, res) => {
  try {
    const consultant = await userModel
      .find({ preRegister: req.params.id })
      .populate("preRegister");
    return res.status(200).json(consultant);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const getConsultantInfoById = async (req, res) => {
  try {
    const consultant = await userModel
      .findById(req.params.id)
      .populate("preRegister");
    const pendingCount = await preRegistrationModel.countDocuments({
      status: "PENDING",
    });
    const traiteCount = await preRegistrationModel.countDocuments({
      status: "VALIDATED",
    });
    const RejeteCount = await preRegistrationModel.countDocuments({
      status: "NOTVALIDATED",
    });
    const allpreregistration = await preRegistrationModel.countDocuments({});
    const newMission = await newMissionModel.countDocuments();

    return res.status(200).json({
      consultant: consultant,
      pendingCount: pendingCount,
      allpreregistration: allpreregistration,
      newMission: newMission,
      traiteCount: traiteCount,
      RejeteCount: RejeteCount,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const getConsultantInfoWithMissionById = async (req, res) => {
  try {
    const consultant = await userModel
      .findById(req.params.id)
      .populate("preRegister")
      .populate("missions");
    const AllMission = await newMissionModel.find({ userId: req.params.id });

    const documents = await UserDocument.find({ userId:  req.params.id  });
    console.log(consultant?.missions);
    return res.status(200).json({
      consultant: consultant,
      AllMission: AllMission,
      documents: documents,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
const getConsultantInfoWithMissionById2 = async (req, res) => {
  try {
    const preregistration = await preRegistrationModel.findById(req.params.id);
    const consultant = await userModel
      .findById(preregistration.userId)
      .populate("preRegister");
    const AllMission = await newMissionModel.find({
      userId: preregistration.userId,
    });

    return res.status(200).json({
      consultant: consultant,
      AllMission: [...AllMission, consultant?.preRegister?.missionInfo],
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const getCurrentConsultantById = async (req, res) => {
  try {
    const consultant = await userModel
      .findById(req.user.id)
      .populate("preRegister");
    return res.status(200).json({
      data: consultant,
      action: "userController.js/getCurrentConsultantById",
      status: "success",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      action: "userController.js/getCurrentConsultantById",
      message: "Internal Server Error",
    });
  }
};

const updateConsultantProfileImageById = async (req, res) => {
  const { image } = req.files;

  try {
    const imageUrl = await uploadFileToCloudinary(image, "consultantProfile");
    const consultant = await userModel.findById(req.user.id);
    consultant.image = imageUrl;
    const updatedConsultant = await consultant.save();
// For updateConsultantProfileImageById - After successful image update
await new LogModel({
  userId: req.user.id,
  action: 'Mise à jour de l\'image de profil',
  details: `L'image de profil de ${req.user.id} a été mise à jour avec succès.`
}).save();
    return res.status(200).json({
      data: updatedConsultant,
      action: "userController.js/updateConsultantProfileImageById",
      status: "success",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      action: "userController.js/updateConsultantProfileImageById",
      message: "Internal Server Error",
    });
  }
};

const updateConsultantCINById = async (req, res) => {
  if (!req.files || !req.files.image || !req.user || !req.user.id) {
    await new LogModel({
      userId: req.user.id,
      action: 'Mise à jour CIN',
      details: 'Échec de la mise à jour de CIN : champs requis manquants.',
    }).save();

    return res.status(400).json({
      status: "error",
      action: "userController.js/updateConsultantCINById",
      message: "Champs requis manquants (image ou ID utilisateur).",
    });
  }

  const { image } = req.files;

  try {
    const imageUrl = await uploadFileToCloudinary(image, "consultantCIN");
    const consultant = await userModel.findById(req.user.id).populate("preRegister");

    if (!consultant || !consultant.preRegister) {
      await new LogModel({
        userId: req.user.id,
        action: 'Mise à jour CIN',
        details: 'Consultant ou pré-enregistrement non trouvé.',
      }).save();

      return res.status(404).json({
        status: "error",
        action: "userController.js/updateConsultantCINById",
        message: "Consultant ou pré-enregistrement non trouvé.",
      });
    }

    consultant.preRegister.personalInfo.identificationDocument.value = imageUrl;
    await consultant.preRegister.save();

    await new LogModel({
      userId: req.user.id,
      action: 'Mise à jour CIN',
      details: 'La CIN du consultant a été mise à jour avec succès.',
    }).save();

    return res.status(200).json({
      data: consultant,
      action: "userController.js/updateConsultantCINById",
      status: "success",
    });
  } catch (error) {
    console.error(error);

    await new LogModel({
      userId: req.user.id,
      action: 'Mise à jour CIN',
      details: 'Erreur interne du serveur lors de la mise à jour de la CIN.',
    }).save();

    return res.status(500).json({
      status: "error",
      action: "userController.js/updateConsultantCINById",
      message: "Erreur interne du serveur.",
    });
  }
};

const updateConsultantRIBById = async (req, res) => {
  // Ensure image file and user ID are present
  if (!req.files || !req.files.image || !req.user || !req.user.id) {
    return res.status(400).json({
      status: "error",
      action: "userController.js/updateConsultantRIBById",
      message: "Missing required fields (image or user ID)",
    });
  }

  const { image } = req.files;

  try {
    const imageUrl = await uploadFileToCloudinary(image, "consultantRIB");

    // Find the user and populate preRegister
    const consultant = await userModel
      .findById(req.user.id)
      .populate("preRegister");

    // Check if consultant and preRegister exist
    if (!consultant || !consultant.preRegister) {
      return res.status(404).json({
        status: "error",
        action: "userController.js/updateConsultantRIBById",
        message: "Consultant or pre-registration not found",
      });
    }

    // Update the nested document field
    consultant.preRegister.personalInfo.ribDocument.value = imageUrl;

    // Explicitly save the preRegister document to persist changes
    await consultant.preRegister.save();
    await new LogModel({
      userId: req.user.id,
      action: 'Mise à jour RIB',
      details: 'Le RIB a été mis à jour avec succès.'
    }).save();
    // No need to save the consultant if only preRegister was changed
    return res.status(200).json({
      data: consultant, // or you might want to reload the consultant to reflect the update
      action: "userController.js/updateConsultantRIBById",
      status: "success",
    });
  } catch (error) {
    console.error(error);
    await new LogModel({
      userId: req.user.id,
      action: 'Mise à jour RIB',
      details: 'Échec de la mise à jour du RIB : erreur interne du serveur.'
    }).save();
    return res.status(500).json({
      status: "error",
      action: "userController.js/updateConsultantRIBById",
      message: "Internal Server Error",
    });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return sendError(res, "Please provide a valid email!");
  }

  const user = await userModel.findOne({ email });
  if (!user) {
    return sendError(res, "Sorry! User not found!");
  }

  const token = await resetTokenModels.findOne({ owner: user._id });
  if (token) {
    return sendError(res, "You can request a new token after one hour!");
  }

  const resetToken = await createRandomBytes();
  // const resetTokenExpire = Date.now() + 3600000;

  const newToken = new resetTokenModels({
    owner: user._id,
    token: resetToken,
  });

  await newToken.save();

  mailer.send(
    {
      to: ["zbousnina@yahoo.com", user.email],
      subject: "Verification code",
      html: generatePasswordResetTemplate(
        `https://my-krew-fron-end.vercel.app/reset-password?token=${resetToken}&id=${user._id}`
      ),
    },
    (err) => {}
  );

  res
    .status(200)
    .json({
      success: true,
      message: "Reset password link has been sent to your email!",
    });
};
const resetPassword = async (req, res) => {
  const { password } = req.body;
  const user = await userModel.findById(req.user._id);
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
  await user.save();

  await resetTokenModels.findOneAndDelete({ owner: user._id });

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
const updatePassword = async (req, res) => {
  let responseSent = false;
  const { errors, isValid } = changePasswordValidation(req.body);

  try {
    // Check validation
    if (!isValid) {
      responseSent = true;
      return res.status(404).json(errors);
    }

    // Find user by req.user.id
    const user = await userModel.findById(req.user.id);

    if (!user) {
      errors.email = "User not found";
      responseSent = true;
      return res.status(404).json(errors);
    }

    // Check if new password and confirm match
    if (req.body.newPassword !== req.body.confirm) {
      errors.confirm = "Password and confirm password do not match";
      responseSent = true;
      return res.status(400).json(errors);
    }

    // Update password and set firstLogin to false
    const newPassword = bcrypt.hashSync(req.body.newPassword.trim(), 10);
    user.password = newPassword;
    user.firstLogin = false;

    await user.save();
    await new LogModel({
      userId: req.user.id,
      action: 'Mise à jour du mot de passe',
      details: 'Le mot de passe a été mis à jour avec succès.'
    }).save();
    responseSent = true;
    return res
      .status(200)
      .json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    if (!responseSent) {
      responseSent = true;

      return res.status(500).json({ success: false, message: "error" });
    }
  }
};

const AddVirement = async (req, res) => {
  try {
    const { typeVirement, montant } = req.body;
    const userId = req.params.id;

    // Create a new virement
    const newVirement = await virementModel.create({
      userId,
      typeVirement,
      montant,
    });

    // Log the successful creation of the virement
    await new LogModel({
      userId: req.user.id,
      action: 'Création de virement',
      details: `Un nouveau virement de type "${typeVirement}" d'un montant de ${montant} a été créé pour l'utilisateur ${userId}.`
    }).save();

    // Return the newly created virement
    return res.status(201).json(newVirement);
  } catch (error) {
    console.error(error);



    return res.status(500).json({ error: "Erreur interne du serveur" });
  }
};

const getConsultantVirement = async (req, res) => {
  try {
    const userId = req.params.id;
    const virements = await virementModel.find({ userId });
    return res
      .status(200)
      .json({
        data: virements,
        status: "success",
        action: "userController.js/getConsultantVirement",
      });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({
        message: "Internal Server Error",
        status: "error",
        action: "userController.js/getConsultantVirement",
      });
  }
};

module.exports = {
  authUser,
  registerUser,
  getAllConsultant,
  getConsultantById,
  getConsultantInfoById,
  getConsultantInfoWithMissionById,
  getConsultantInfoWithMissionById2,
  getCurrentConsultantById,
  updateConsultantProfileImageById,
  updateConsultantCINById,
  updateConsultantRIBById,
  forgotPassword,
  resetPassword,
  updatePassword,
  AddVirement,
  getConsultantVirement
};

const uploadFileToCloudinary = async (file, folderName) => {
  if (file) {
    const result = await cloudinary.uploader.upload(file.path, {
      resource_type: "auto",
      folder: folderName,
      public_id: `${folderName}_${Date.now()}`,
      overwrite: true,
    });

    return result.secure_url;
  }
  return null;
};