const newMission = require("../models/newMissionModel");
const cloudinary = require("../utils/uploadImage");
const ContractProcess = require("../models/contractModel.js");
const User = require("../models/userModel.js");
const preRegistrationModel = require("../models/preRegistrationModel");
const newMissionModel = require("../models/newMissionModel");
const userModel = require("../models/userModel.js");
const contractModel = require("../models/contractModel.js");

const createMission = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      position,
      email,
      phoneNumber,
      company,
      metier,
      secteur,
      client,
      tjm,
      debut,
      fin,
    } = req.body;
    const { simulationfile } = req.files;

    //new contract process
    const newContractProcess = new ContractProcess();
    const savedContractProcess = await newContractProcess.save();

    // Create a new document based on your model structure
    const mission = new newMission({
      userId: req.user.id,
      clientInfo: {
        company: {
          value: company,
        },
        clientContact: {
          firstName: {
            value: firstName,
          },
          lastName: {
            value: lastName,
          },
          position: {
            value: position,
          },
          email: {
            value: email,
          },
          phoneNumber: {
            value: phoneNumber,
          },
        },
      },
      missionInfo: {
        profession: { value: metier },
        industrySector: { value: secteur },
        finalClient: { value: client },
        dailyRate: { value: tjm },
        startDate: { value: debut },
        endDate: { value: fin },
        isSimulationValidated: {
          value: await uploadFileToCloudinary(
            simulationfile,
            "isSimulationValidated"
          ),
        },
      },
      status: "PENDING",
      contractProcess: savedContractProcess._id,
    });
    const savedMission = await mission.save();
    const user = await User.findById(req.user.id);
    user.missions.push(savedMission._id);
    await user.save();
    return res.status(200).json({
      status: "success",
      action: "mission.controller.js/createMission",
      data: savedMission,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
      status: "error",
      action: "mission.controller.js/createMission",
    });
  }
};

const updateTjm = async (req, res) => {
  try {
    const { id } = req.params;
    const { tjm } = req.body;
    const mission = await newMission.findById(id);
    mission.missionInfo.dailyRate.value = tjm;
    const updatedMission = await mission.save();
    return res.status(200).json({
      status: "success",
      action: "mission.controller.js/updateTjm",
      data: updatedMission,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
      status: "error",
      action: "mission.controller.js/updateTjm",
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



const updateMissionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;





      const mission = await newMission.findById(id);
      mission.status = status;
      let updatedMission = await mission.save();

    return res.status(200).json({
      status: "success",
      action: "mission.controller.js/updateMissionStatus",

    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
      status: "error",
      action: "mission.controller.js/updateMissionStatus",
    });
  }
}

const getMissionById = async (req, res) => {
  try {
    const mission = await newMissionModel.findById(req.params.id).populate({
      path: 'userId',
      populate: {
        path: 'preRegister',
        // You can specify additional options for populating the 'preRegister' field here if needed
      }
    });
    return res.status(200).json(mission);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const getConsultantInfoById = async (req, res) => {
  try {

    const Mission = await newMissionModel.findById(req.params.id).populate({
      path: 'userId',
      populate: {
        path: 'preRegister',
        // You can specify additional options for populating the 'preRegister' field here if needed
      }
    }).populate("contractProcess");
    const consultant = await userModel
      .findById(Mission?.userId?._id)
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
      Mission:Mission
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const validateProcessus = async (req, res) => {
  try {
    const { step, status } = req.body;

    const preRegistration = await contractModel.findById(req.params.id);

    if (!preRegistration) {
      return res.status(404).json({ message: "Pré-inscription non trouvée" });
    }

    let updateField;

    switch (step) {
      case "Validation Informations Personnelles":
        updateField = "contactClient";
        break;
      case "Prise de contact avec le client":
        updateField = "clientValidation";
        break;
      case "Contrat de service validé avec le client":
        updateField = "jobCotractEdition";
        break;
      default:
        updateField = "contractValidation";
        break;
    }

    const updatedPreRegistration = await contractModel.findOneAndUpdate(
      { _id: req.params.id },
      {
        [updateField]:
          status === "Validée"
            ? "VALIDATED"
            : status === "En cours"
            ? "PENDING"
            : status === "En attente"
            ? "NOTVALIDATED"
            : "NOTVALIDATED",
      },
      { new: true }
    );

    if (!updatedPreRegistration) {
      return res.status(404).json({ error: "preregister not found" });
    }

   // Check if all fields are 'VALIDATED' and update the status accordingly
   const allFieldsValidated = [
    "contactClient",
    "clientValidation",
    "jobCotractEdition",
    "contractValidation",
  ].every((field) => updatedPreRegistration[field] === "VALIDATED");

  if (allFieldsValidated) {
    // Update the status to 'VALIDATED'
console.log("yes")

    updatedPreRegistration.statut = "VALIDATED";
    const mission = await newMissionModel.findOne({ contractProcess: req.params.id }).exec();

    console.log(mission)
    mission.status = "VALID"
    mission.missionKilled = false;
    await mission.save()
    await updatedPreRegistration.save();
  } else {
    updatedPreRegistration.statut = "PENDING";
    const mission = await newMissionModel.findOne({ contractProcess: req.params.id }).exec();
    mission.missionKilled = false;


    console.log(mission)
    mission.status = "WAITINGCONTRACT"
    await mission.save()

    await updatedPreRegistration.save();
  }

    return res.status(200).json(updatedPreRegistration);
  } catch (error) {
    console.error(
      "Erreur lors de la validation des informations du client de la pré-inscription :",
      error
    );
    return res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

const killMission = async (req, res) => {
  console.log("yes")
  const missionId = req.params.id; // Assuming you have the missionId in the request parameters

  try {
    // Find the mission by ID
    const mission = await newMissionModel.findById(missionId);

    if (!mission) {
      return res.status(404).json({ error: "Mission not found" });
    }


    // Set missionKilled to true and update status to REJECTED
    mission.missionKilled = true;
    mission.status = "REJECTED";

    // Save the updated mission
    await mission.save();

    res.status(200).json({ message: "Mission killed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  createMission,
  updateTjm,
  updateMissionStatus,
  getMissionById,
  getConsultantInfoById,
  validateProcessus,
  killMission
};