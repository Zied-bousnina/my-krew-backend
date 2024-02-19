const userModel = require("../models/userModel");
const Preregister = require("../models/preRegistrationModel");
const validateLoginInput = require("../validations/login");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validateRegisterInput = require("../validations/validateRegisterInput");
const preRegistrationModel = require("../models/preRegistrationModel");
const newMissionModel = require("../models/newMissionModel");
const cloudinary = require("../utils/uploadImage");

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
    const preRegistration = await Preregister.findOne({
      userId: user._id,
    }).populate("contractProcess");
    console.log(preRegistration);
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
        },
        process.env.SECRET_KEY,
        { expiresIn: Number.MAX_SAFE_INTEGER }
      );
      console.log(token);

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
    console.log(error);
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
    console.log(pendingCount);
    console.log(allpreregistration);
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
      .populate("preRegister");
    const AllMission = await newMissionModel.find({ userId: req.params.id });

    console.log({
      consultant: consultant,
      AllMission: [...AllMission, consultant?.preRegister?.missionInfo],
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
    const updatedConsultant =await consultant.save();

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
  // Ensure image file and user ID are present
  if (!req.files || !req.files.image || !req.user || !req.user.id) {
    return res.status(400).json({
      status: "error",
      action: "userController.js/updateConsultantCINById",
      message: "Missing required fields (image or user ID)",
    });
  }

  const { image } = req.files;

  try {
    const imageUrl = await uploadFileToCloudinary(image, "consultantCIN");
    
    // Find the user and populate preRegister
    const consultant = await userModel.findById(req.user.id).populate("preRegister");
    
    // Check if consultant and preRegister exist
    if (!consultant || !consultant.preRegister) {
      return res.status(404).json({
        status: "error",
        action: "userController.js/updateConsultantCINById",
        message: "Consultant or pre-registration not found",
      });
    }

    // Update the nested document field
    consultant.preRegister.personalInfo.identificationDocument.value = imageUrl;
    
    // Explicitly save the preRegister document to persist changes
    await consultant.preRegister.save();

    // No need to save the consultant if only preRegister was changed
    return res.status(200).json({
      data: consultant, // or you might want to reload the consultant to reflect the update
      action: "userController.js/updateConsultantCINById",
      status: "success",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      action: "userController.js/updateConsultantCINById",
      message: "Internal Server Error",
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
    const consultant = await userModel.findById(req.user.id).populate("preRegister");
    
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

    // No need to save the consultant if only preRegister was changed
    return res.status(200).json({
      data: consultant, // or you might want to reload the consultant to reflect the update
      action: "userController.js/updateConsultantRIBById",
      status: "success",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      action: "userController.js/updateConsultantRIBById",
      message: "Internal Server Error",
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
  getCurrentConsultantById,
  updateConsultantProfileImageById,
  updateConsultantCINById,
  updateConsultantRIBById
};

const uploadFileToCloudinary = async (file, folderName) => {
  if (file) {
    const result = await cloudinary.uploader.upload(file.path, {
      resource_type: "auto",
      folder: folderName,
      public_id: `${folderName}_${Date.now()}`,
      overwrite: true,
    });
    console.log(result);
    return result.secure_url;
  }
  return null;
};
