const newMission = require("../models/newMissionModel");
const preRegistartion = require("../models/preRegistrationModel");

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

module.exports = {
  getConsultantMissions,
  getConsultantMissionsPending,
  getConsultantMissionsWaitingContact,
  getConsultantMissionsValidated,
  getConsultantMissionsNotValidated,
  getConsultantLastMission,
  getConsultantClosestEndDateMission,
};
