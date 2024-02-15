const userModel = require("../models/userModel");
const preRegistartion = require("../models/preRegistrationModel");

const getConsultantMissions = async (req, res) => {
  const { id } = req.params;
  try {
    const missions = await preRegistartion.find({ userId: id });
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
    const missions = await preRegistartion.find({
      userId: id,
      "missionInfo.status": "PENDING",
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
    const missions = await preRegistartion.find({
      userId: id,
      "missionInfo.status": "WORKINGONIT",
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
    const missions = await preRegistartion.find({
      userId: id,
      "missionInfo.status": "VALID",
      "missionInfo.status": "COMPLETED",
      "missionInfo.status": "REJECTED",
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
    const missions = await preRegistartion.find({
      userId: id,
      "missionInfo.status": "REJECTED",
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
    const missions = await preRegistartion
      .find({
        userId: id,
      })
      .sort({ createdAt: -1 })
      .limit(1);

    return res.status(200).json({
      action: "consultant.controller.js/getConsultantLastMission",
      status: "success",
      data: missions[0], // Return the first (and only) mission
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

module.exports = {
  getConsultantMissions,
  getConsultantMissionsPending,
  getConsultantMissionsWaitingContact,
  getConsultantMissionsValidated,
  getConsultantMissionsNotValidated,
  getConsultantLastMission,
};
