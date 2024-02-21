const preRegistrationModel = require("../models/preRegistrationModel");
const preregistrationStep1Validation = require("../validations/preregistrationStep1Validation");
const cloudinary = require("../utils/uploadImage");
const userModel = require("../models/userModel");
const moment = require("moment");
const ContractProcess = require("../models/contractModel.js");
const newMissionModel = require("../models/newMissionModel.js");
const newMission = require("../models/newMissionModel");

const createPreRegistration1 = async (req, res) => {
  try {
    const { errors, isValid } = preregistrationStep1Validation(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }

    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      dateOfBirth,
      location,
      nationality,
    } = req.body;

    const query = { userId: req.user.id };

    const update = {
      $set: {
        [`personalInfo.firstName.value`]: firstName,
        [`personalInfo.lastName.value`]: lastName,
        [`personalInfo.email.value`]: email,
        [`personalInfo.phoneNumber.value`]: phoneNumber,
        [`personalInfo.dateOfBirth.value`]: dateOfBirth,
        [`personalInfo.location.value`]: location,
        [`personalInfo.nationality.value`]: nationality,
      },
    };

    const options = { new: true, upsert: true };

    const updatedPreRegistration = await preRegistrationModel.findOneAndUpdate(
      query,
      update,
      options
    );

    return res.status(200).json(updatedPreRegistration);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const createPreRegistration2 = async (req, res) => {
  try {
    const { cin, ribDocument, permis } = req.files;
    const { rib, avs } = req.body;
    console;
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

    const query = { userId: req.user.id };

    const update = {
      $set: {
        [`personalInfo.socialSecurityNumber.value`]: avs,
        [`personalInfo.identificationDocument.value`]:
          await uploadFileToCloudinary(cin, "cin"),
        [`personalInfo.rib.value`]: rib,
        [`personalInfo.ribDocument.value`]: await uploadFileToCloudinary(
          ribDocument,
          "ribDocument"
        ),
        [`personalInfo.carInfo.hasCar.value`]: permis ? true : false,
        [`personalInfo.carInfo.drivingLicense.value`]: permis
          ? await uploadFileToCloudinary(permis, "permis")
          : null,
      },
    };

    const options = { new: true, upsert: true };

    const updatedPreRegistration = await preRegistrationModel.findOneAndUpdate(
      query,
      update,
      options
    );

    return res.status(200).json(updatedPreRegistration);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const createPreRegistration3 = async (req, res) => {
  try {
    const { firstName, lastName, position, email, phoneNumber, company } =
      req.body;

    const query = { userId: req.user.id };

    const update = {
      $set: {
        [`clientInfo.company.value`]: company,
        [`clientInfo.clientContact.firstName.value`]: firstName,
        [`clientInfo.clientContact.lastName.value`]: lastName,
        [`clientInfo.clientContact.position.value`]: position,
        [`clientInfo.clientContact.email.value`]: email,
        [`clientInfo.clientContact.phoneNumber.value`]: phoneNumber,
      },
    };

    const options = { new: true, upsert: true };

    const updatedPreRegistration = await preRegistrationModel.findOneAndUpdate(
      query,
      update,
      options
    );

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
      missionInfo:{},
      status: "PENDING",
      contractProcess: savedContractProcess._id,
    });

    await mission.save();

    return res.status(200).json(updatedPreRegistration);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
const createPreRegistration4 = async (req, res) => {
  try {
    const { cin, ribDocument, permis } = req.files;
    const { rib, avs } = req.body;
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
    const { simulationfile } = req.files;
    const missionInfo = req.body;
    const query = { userId: req.user.id };

const uploadedSimulatedFile=await uploadFileToCloudinary(simulationfile, "isSimulationValidated")

    const update = {
      $set: {
        [`missionInfo.profession.value`]: missionInfo.metier,
        [`missionInfo.industrySector.value`]: missionInfo.secteur,
        [`missionInfo.finalClient.value`]: missionInfo.client,
        [`missionInfo.dailyRate.value`]: missionInfo.tjm,
        [`missionInfo.startDate.value`]: missionInfo.debut,
        [`missionInfo.endDate.value`]: missionInfo.fin,
        [`missionInfo.isSimulationValidated.value`]:uploadedSimulatedFile,
        [`status`]: "PENDING",
      },
    };

    const options = { new: true, upsert: true };

    const updatedPreRegistration = await preRegistrationModel.findOneAndUpdate(
      query,
      update,
      options
    );

    const mission = newMission.findOne({ userId: req.user.id });
    mission.missionInfo={
        profession: { value: missionInfo.metier },
        industrySector: { value: missionInfo.secteur },
        finalClient: { value: missionInfo.client },
        dailyRate: { value: missionInfo.tjm },
        startDate: { value: missionInfo.debut },
        endDate: { value: missionInfo.fin },
        isSimulationValidated: {
          value: uploadedSimulatedFile,
        },
      }
      await mission.save()

    return res.status(200).json(updatedPreRegistration);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const getPreregistration = async (req, res) => {
  try {
    const preRegistration = await preRegistrationModel.findOne({
      userId: req.user.id,
    });
    return res.status(200).json(preRegistration);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const getPendingPreregistration = async (req, res) => {
  try {
    const preRegistration = await preRegistrationModel.find({
      status: { $in: ["PENDING", "NOTVALIDATED"] },
    });
    const preRegistration2 = await newMissionModel
      .find({ status: { $in: ["PENDING", "REJECTED"] } })
      .populate("userId")
      .populate("preRegister");

    return res.status(200).json([...preRegistration, ...preRegistration2]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const getConsultantStats = async (req, res) => {
  try {
    const users = await userModel.find({ role: "CONSULTANT" });

    let numberOfConsultants = users.length;
    let numberOfMissions = 0;
    let totalTJM = 0;
    let totalRevenue = 0;

    const today = new Date();
    const startOfYear = moment().startOf("year").toDate();

    users.forEach((user) => {
      if (user.missions && user.missions.length > 0) {
        user.missions.forEach((mission) => {
          numberOfMissions++;

          const missionInfo = mission.missionInfo;
          if (missionInfo && missionInfo.startDate && missionInfo.endDate) {
            const startDate = new Date(missionInfo.startDate);
            const endDate = new Date(missionInfo.endDate);

            if (startDate <= today && today <= endDate) {
              const tjm = missionInfo.dailyRate;
              totalTJM += tjm;

              if (startDate >= startOfYear) {
                totalRevenue += tjm;
              }
            }
          }
        });
      }
    });

    console.log(numberOfMissions);
    const averageTJM = numberOfMissions > 0 ? totalTJM / numberOfMissions : 0;

    return res.status(200).json({
      numberOfConsultants: numberOfConsultants,
      averageTJM: averageTJM,
      totalRevenue: totalRevenue,
    });
  } catch (error) {
    console.error(
      "Erreur lors du calcul des statistiques des consultants :",
      error
    );
    return res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

const validatePreregistrationClientInfo = async (req, res) => {
  try {
    const {
      firstName,
      email,
      phoneNumber,
      location,
      nationality,
      socialSecurityNumber,
      dateOfBirth,
      ribDocument,
      identificationDocument,
      carInfo,
      // Client ---------------------
      clientContactFirstName,
      clientContactLastName,
      clientContactPhoneNumber,
      clientContactemail,
      company,
      position,
    } = req.body;

    const preRegistration = await preRegistrationModel.findById(req.params.id);
    if (!preRegistration) {
      return res.status(404).json({ message: "Pré-inscription non trouvée" });
    }

    let validated = "NOTVALIDATED"; // Initialize validated variable
    let validateClient = "NOTVALIDATED"; // Initialize validated variable

    if (
      !firstName &&
      !email &&
      !phoneNumber &&
      !location &&
      !nationality &&
      !socialSecurityNumber &&
      !dateOfBirth &&
      !ribDocument &&
      !identificationDocument &&
      !carInfo
    ) {
      // If any of the fields is present, set validated to "VALIDATED"

      validated = "VALIDATED";

      const newContractProcess = new ContractProcess();
      const savedContractProcess = await newContractProcess.save();

      await preRegistrationModel.findOneAndUpdate(
        { _id: req.params.id },
        {
          contractProcess: savedContractProcess._id,
        },
        { new: true }
      );
    }
    if (
      !clientContactFirstName &&
      !clientContactLastName &&
      !clientContactPhoneNumber &&
      !clientContactemail &&
      !company &&
      !position
    ) {
      validateClient = "VALIDATED";
    }

    const updatedPreRegistration = await preRegistrationModel.findOneAndUpdate(
      { _id: req.params.id },
      {
        "personalInfo.firstName.validated": firstName === "" ? true : false,
        "personalInfo.firstName.causeNonValidation": firstName,

        "personalInfo.email.validated": email === "" ? true : false,
        "personalInfo.email.causeNonValidation": email,
        "personalInfo.phoneNumber.validated": phoneNumber === "" ? true : false,
        "personalInfo.phoneNumber.causeNonValidation": phoneNumber,
        "personalInfo.dateOfBirth.validated": dateOfBirth === "" ? true : false,
        "personalInfo.dateOfBirth.causeNonValidation": dateOfBirth,
        "personalInfo.location.validated": location === "" ? true : false,
        "personalInfo.location.causeNonValidation": location,
        "personalInfo.nationality.validated": nationality === "" ? true : false,
        "personalInfo.nationality.causeNonValidation": nationality,
        "personalInfo.socialSecurityNumber.validated":
          socialSecurityNumber === "" ? true : false,
        "personalInfo.socialSecurityNumber.causeNonValidation":
          socialSecurityNumber,
        "personalInfo.identificationDocument.validated":
          identificationDocument === "" ? true : false,
        "personalInfo.identificationDocument.causeNonValidation":
          identificationDocument,
        "personalInfo.carInfo.drivingLicense.validated":
          carInfo === "" ? true : false,
        "personalInfo.carInfo.drivingLicense.causeNonValidation": carInfo,
        // client info
        "clientInfo.company.validated": company === "" ? true : false,
        "clientInfo.company.causeNonValidation": company,
        "clientInfo.clientContact.position.validated":
          position === "" ? true : false,
        "clientInfo.clientContact.position.causeNonValidation": position,
        "clientInfo.clientContact.firstName.validated":
          clientContactFirstName === "" ? true : false,
        "clientInfo.clientContact.firstName.causeNonValidation":
          clientContactFirstName,
        "clientInfo.clientContact.lastName.validated":
          clientContactLastName === "" ? true : false,
        "clientInfo.clientContact.lastName.causeNonValidation":
          clientContactLastName,
        "clientInfo.clientContact.phoneNumber.validated":
          clientContactPhoneNumber === "" ? true : false,
        "clientInfo.clientContact.phoneNumber.causeNonValidation":
          clientContactPhoneNumber,
        "clientInfo.clientContact.email.validated":
          clientContactemail === "" ? true : false,
        "clientInfo.clientContact.email.causeNonValidation": clientContactemail,

        status:
          validated == "VALIDATED" && validateClient == "VALIDATED"
            ? "VALIDATED"
            : "PENDING",
        validationRH:
          validated == "VALIDATED" && validateClient == "VALIDATED"
            ? "VALIDATED"
            : "NOTVALIDATED",
      },
      { new: true }
    );

    if (!updatedPreRegistration) {
      return res.status(404).json({ error: "preregister not found" });
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

const UpdateInformationClientAndPersonalConsultantInfo = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      location,
      email,
      phoneNumber,
      nationality,
      socialSecurityNumber,
      rib,
      dateOfBirth,

      // Client
      firstNameClient,
      lastNameClient,
      emailClient,
      phoneNumberClient,
      company,

      position,
    } = req.body;

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
    const { identificationDocument, carInfo, ribDocument } = req.files;

    const preRegistration = await preRegistrationModel.findById(req.params.id);

    if (!preRegistration) {
      return res.status(404).json({ message: "Pré-inscription non trouvée" });
    }
    const updatedPreRegistration = await preRegistrationModel.findOneAndUpdate(
      { _id: req.params.id },
      {
        "personalInfo.firstName.value": firstName,
        "personalInfo.lastName.value": lastName,
        "personalInfo.email.value": email,
        "personalInfo.phoneNumber.value": phoneNumber,
        "personalInfo.dateOfBirth.value": dateOfBirth,
        "personalInfo.location.value": location,
        "personalInfo.nationality.value": nationality,
        "personalInfo.socialSecurityNumber.value": socialSecurityNumber,
        "personalInfo.identificationDocument.value":
          await uploadFileToCloudinary(identificationDocument),
        "personalInfo.rib.value": rib,
        "personalInfo.ribDocument.value": await uploadFileToCloudinary(
          ribDocument
        ),
        "personalInfo.carInfo.drivingLicense.value": carInfo
          ? await uploadFileToCloudinary(carInfo)
          : null,
        "personalInfo.carInfo.hasCar.value": carInfo ? true : false,

        // client info
        "clientInfo.company.value": company,
        "clientInfo.clientContact.position.value": position,
        "clientInfo.clientContact.firstName.value": firstNameClient,
        "clientInfo.clientContact.lastName.value": lastNameClient,
        "clientInfo.clientContact.phoneNumber.value": phoneNumberClient,
        "clientInfo.clientContact.emailClient.value": emailClient,
        status: "PENDING",
        validationRH: "PENDING",
      },
      { new: true }
    );

    if (!updatedPreRegistration) {
      return res.status(404).json({ error: "preregister not found" });
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

const validateProcessus = async (req, res) => {
  try {
    const { step, status } = req.body;

    const preRegistration = await preRegistrationModel.findById(req.params.id);

    if (!preRegistration) {
      return res.status(404).json({ message: "Pré-inscription non trouvée" });
    }

    let updateField;

    switch (step) {
      case "Validation Informations Personnelles":
        updateField = "validateClient";
        break;
      case "Prise de contact avec le client":
        updateField = "validateContractWithClient";
        break;
      case "Contrat de service validé avec le client":
        updateField = "validateContractTravail";
        break;
      default:
        updateField = "transmissionContract";
        break;
    }

    const updatedPreRegistration = await preRegistrationModel.findOneAndUpdate(
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
      "validateClient",
      "validateContractWithClient",
      "validateContractTravail",
      "transmissionContract",
    ].every((field) => updatedPreRegistration[field] === "VALIDATED");

    if (allFieldsValidated) {
      // Update the status to 'VALIDATED'

      updatedPreRegistration.status = "VALIDATED";
      updatedPreRegistration.validationRH = "VALIDATED";
      await updatedPreRegistration.save();
    } else {
      updatedPreRegistration.status = "PENDING";
      updatedPreRegistration.validationRH = "PENDING";
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

const sendNote = async (req, res) => {
  try {
    const { note } = req.body;
    const preRegistration = await preRegistrationModel.findById(req.params.id);
    if (!preRegistration) {
      return res.status(404).json({ message: "Pré-inscription non trouvée" });
    }
    const updatedPreRegistration = await preRegistrationModel.findOneAndUpdate(
      { _id: req.params.id },
      { noteAuClient: note },
      { new: true }
    );

    if (!updatedPreRegistration) {
      return res.status(404).json({ error: "preregister not found" });
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

module.exports = {
  createPreRegistration1,
  createPreRegistration2,
  createPreRegistration3,
  createPreRegistration4,
  getPreregistration,
  getPendingPreregistration,
  getConsultantStats,
  validatePreregistrationClientInfo,
  validateProcessus,
  sendNote,
  UpdateInformationClientAndPersonalConsultantInfo,
};
