const newMission = require("../models/newMissionModel");
const preRegistartion = require("../models/preRegistrationModel");

const getConsultantMissions = async (req, res) => {
  const { id } = req.params;
  try {
    const preRegistartionMission = await preRegistartion.find({ userId: id });
    const newMissions = await newMission.find({ userId: id });
    const missions = preRegistartionMission.concat(newMissions);
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
    const preRegistartionMissions = await preRegistartion.find({
      userId: id,
      "missionInfo.status": "PENDING",
    });
    const newMissions = await newMission.find({
      userId: id,
      status: "PENDING",
    });
    const missions = preRegistartionMissions.concat(newMissions);
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
    const preRegistartionMissions = await preRegistartion.find({
      userId: id,
      "missionInfo.status": "WAITINGCONTARCT",
    });
    const newMissions = await newMission.find({
      userId: id,
      status: "WAITINGCONTARCT",
    });
    const missions = preRegistartionMissions.concat(newMissions);
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
    const preRegistartionMissions = await preRegistartion.find({
      userId: id,
      "missionInfo.status": "VALID",
      "missionInfo.status": "COMPLETED",
      "missionInfo.status": "REJECTED",
    });
    const newMissions = await newMission.find({
      userId: id,
      status: "VALID",
      status: "COMPLETED",
      status: "REJECTED",
    });
    const missions = preRegistartionMissions.concat(newMissions);
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
    const preRegistartionMissions = await preRegistartion.find({
      userId: id,
      "missionInfo.status": "REJECTED",
    });
    const newMissions = await newMission.find({
      userId: id,
      status: "REJECTED",
    });
    const missions = preRegistartionMissions.concat(newMissions);
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
    if (newMissions.length > 0)
      return res.status(200).json({
        action: "consultant.controller.js/getConsultantLastMission",
        status: "success",
        data: newMissions[newMissions.length - 1],
      });
    else {
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

module.exports = {
  getConsultantMissions,
  getConsultantMissionsPending,
  getConsultantMissionsWaitingContact,
  getConsultantMissionsValidated,
  getConsultantMissionsNotValidated,
  getConsultantLastMission,
};
