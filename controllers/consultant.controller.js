const LogModel = require("../models/Log.model");
const newMission = require("../models/newMissionModel");
const preRegistartion = require("../models/preRegistrationModel");
const UserDocument = require("../models/userDocumentModel");
const userModel = require("../models/userModel");
const cloudinary = require("../utils/uploadImage");
const getConsultantMissions = async (req, res) => {
  const { id } = req.params;
  try {
    const missions = await newMission.find({ userId: id });
    return res.status(200).json({
      action: "consultant.controller.js/getConsultantMissions",
      status: "success",
      data: missions,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      action: "consultant.controller.js/getConsultantMissions",
      status: "error",
      message: "Internal Server Error",
    });
  }
};
const getConsultantMissionsPending = async (req, res) => {
  const { id } = req.params;
  try {
    const missions = await newMission.find({
      userId: id,
      status: "PENDING",
    });
    return res.status(200).json({
      action: "consultant.controller.js/getConsultantMissionsPending",
      status: "success",
      data: missions,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      action: "consultant.controller.js/getConsultantMissionsPending",
      status: "error",
      message: "Internal Server Error",
    });
  }
};
const getConsultantMissionsWaitingContact = async (req, res) => {
  const { id } = req.params;
  try {
    const missions = await newMission.find({
      userId: id,
      status: "WAITINGCONTARCT",
    });
    return res.status(200).json({
      action: "consultant.controller.js/getConsultantMissionsWaitingContact",
      status: "success",
      data: missions,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      action: "consultant.controller.js/getConsultantMissionsWaitingContact",
      status: "error",
      message: "Internal Server Error",
    });
  }
};
const getConsultantMissionsValidated = async (req, res) => {
  const { id } = req.params;
  try {
    const missions = await newMission.find({
      userId: id,
      status: {
        $in: ["VALID", "COMPLETED", "REJECTED"],
      },
    });
    return res.status(200).json({
      action: "consultant.controller.js/getConsultantMissionsValidated",
      status: "success",
      data: missions,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      action: "consultant.controller.js/getConsultantMissionsValidated",
      status: "error",
      message: "Internal Server Error",
    });
  }
};
const getConsultantMissionsNotValidated = async (req, res) => {
  const { id } = req.params;
  try {
    const missions = await newMission.find({
      userId: id,
      status: "REJECTED",
    });
    return res.status(200).json({
      action: "consultant.controller.js/getConsultantMissionsNotValidated",
      status: "success",
      data: missions,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      action: "consultant.controller.js/getConsultantMissionsNotValidated",
      status: "error",
      message: "Internal Server Error",
    });
  }
};
const getConsultantLastMission = async (req, res) => {
  const { id } = req.params;
  try {
    const newMissions = await newMission
      .find({
        userId: id,
      })
      .sort({ createdAt: -1 });
    if (newMissions.length > 0) {
      return res.status(200).json({
        action: "consultant.controller.js/getConsultantLastMission",
        status: "success",
        data: newMissions[newMissions.length - 1],
      });
    } else {
      return res.status(404).json({
        action: "consultant.controller.js/getConsultantLastMission",
        status: "error",
        message: "no mission found",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      action: "consultant.controller.js/getConsultantLastMission",
      status: "error",
      message: "Internal Server Error",
    });
  }
};

const getConsultantClosestEndDateMission = async (req, res) => {
  const { id } = req.params;
  try {
    const newMissions = await newMission
      .find({
        userId: id,
        status: "VALID",
      })
      .sort({ "missionInfo.endDate.value": -1 });
    return res.status(200).json({
      action: "consultant.controller.js/getConsultantLastMission",
      status: "success",
      data: newMissions[0],
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      action: "consultant.controller.js/getConsultantLastMission",
      status: "error",
      message: "Internal Server Error",
    });
  }
};

const addDocumentToConsultant = async (req, res) => {
  const { documentName } = req.body;
  const { consultantId } = req.params;

  try {
    const craFile = await uploadFileToCloudinary(req.files.document, req.body.documentName);
    console.log(craFile);

    // Create a new UserDocument
    const newDocument = new UserDocument({
      userId: consultantId,
      documentName: documentName,
      documentUrl: craFile, // Assuming craFile.url is the URL of the uploaded document
    });

    await newDocument.save();

    // Optionally, log this action
    await new LogModel({
      userId: req.user.id,
      action: 'document ajouté au consultant',
      details: `Document ${documentName} ajouté avec succès.`,
    }).save();

    return res.status(201).json({
      action: "consultant.controller.js/addDocumentToConsultant",
      status: "success",
      data: newDocument,
    });
  } catch (error) {
    console.error("Error adding document to consultant:", error);
    return res.status(500).json({
      action: "consultant.controller.js/addDocumentToConsultant",
      status: "error",
      message: "Internal Server Error",
    });
  }
};

const getAllDocument = async (req, res) => {
  const { consultantId } = req.params;
  try {
    const documents = await UserDocument.find({ userId: consultantId });
    return res.status(200).json({
      action: "consultant.controller.js/getAllDocument",
      status: "success",
      data: documents,
    });
  } catch (error) {
    console.error("Error getting all documents:", error);
    return res.status(500).json({
      action: "consultant.controller.js/getAllDocument",
      status: "error",
      message: "Internal Server Error",
    });
  }
};
//*helper function
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

module.exports = {
  getConsultantMissions,
  getConsultantMissionsPending,
  getConsultantMissionsWaitingContact,
  getConsultantMissionsValidated,
  getConsultantMissionsNotValidated,
  getConsultantLastMission,
  getConsultantClosestEndDateMission,
  addDocumentToConsultant,
  getAllDocument
};
