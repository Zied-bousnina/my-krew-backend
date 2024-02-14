const userModel = require("../models/userModel");

const getConsultantMissions = async (req, res) => {
  const { id } = req.params;
  try {
    const missions = await userModel.findById(id).select("missions");
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
    const missions = await userModel.findById(id).select("missions");
    if (missions.length === 0) {
      missions = missions.filter((mission) => mission.status === "PENDING");
    }
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
const getConsultantMissionsWaitingContact = async (req, res) => {
  const { id } = req.params;
  try {
    const missions = await userModel.findById(id).select("missions");
    if (missions.length === 0) {
      missions = missions.filter(
        (mission) => mission.status === "WAITINGCONTRACT"
      );
    }

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
const getConsultantMissionsValidated = async (req, res) => {
  const { id } = req.params;
  try {
    const missions = await userModel.findById(id).select("missions");
    if (missions.length === 0) {
      missions = missions.filter((mission) => mission.status === "VALIDATED");
    }
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
const getConsultantMissionsNotValidated = async (req, res) => {
  const { id } = req.params;
  try {
    const missions = await userModel.findById(id).select("missions");
    if (missions.length === 0) {
      missions = missions.filter(
        (mission) => mission.status === "NOTVALIDATED"
      );
    }
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

module.exports = {
  getConsultantMissions,
  getConsultantMissionsPending,
  getConsultantMissionsWaitingContact,
  getConsultantMissionsValidated,
  getConsultantMissionsNotValidated,
};
