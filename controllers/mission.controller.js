const newMission = require("../models/newMissionModel");
const cloudinary = require("../utils/uploadImage");
const ContractProcess = require("../models/contractModel.js");
const User = require("../models/userModel.js");

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
      mongoose: savedContractProcess._id,
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

module.exports = {
  createMission,
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
    console.log(result);
    return result.secure_url;
  }
  return null;
};
