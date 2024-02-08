
const preRegistrationModel = require('../models/preRegistrationModel');
const preregistrationStep1Validation = require('../validations/preregistrationStep1Validation')
const cloudinary = require('../utils/uploadImage');
const userModel = require('../models/userModel');
const moment = require('moment');
const createPreRegistration1 = async (req, res) => {
    console.log(req)
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
            nationality
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

            }
        };

        const options = { new: true, upsert: true };

        const updatedPreRegistration = await preRegistrationModel.findOneAndUpdate(query, update, options);

        return res.status(200).json(updatedPreRegistration);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

const createPreRegistration2 = async (req, res) => {
    console.log(req.files)
    try {
        const {
            cin,
            ribDocument,
            permis


           } = req.files;
           const {rib,avs} = req.body;
           const uploadFileToCloudinary = async (file, folderName) => {
            if (file) {
              const result = await cloudinary.uploader.upload(file.path, {
                resource_type: 'auto',
                folder: folderName,
                public_id: `${folderName}_${Date.now()}`,
                overwrite: true,
              });
              console.log(result);
              return result.secure_url;
            }
            return null;
          };


  const query = { userId: req.user.id };

        const update = {
            $set: {
                [`personalInfo.socialSecurityNumber.value`]: avs,
                [`personalInfo.identificationDocument.value`]: await uploadFileToCloudinary(cin, 'cin'),
                [`personalInfo.rib.value`]: rib,
                [`personalInfo.ribDocument.value`]:await uploadFileToCloudinary(ribDocument, 'ribDocument'),
                [`personalInfo.carInfo.hasCar.value`]: permis ? true : false,
                [`personalInfo.carInfo.drivingLicense.value`]: permis ? await uploadFileToCloudinary(permis, 'permis'): null,

            }
        };

        const options = { new: true, upsert: true };

        const updatedPreRegistration = await preRegistrationModel.findOneAndUpdate(query, update, options);

        return res.status(200).json(updatedPreRegistration);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

const createPreRegistration3 = async (req, res) => {
    console.log(req.files)
    try {
        const {
            cin,
            ribDocument,
            permis


           } = req.files;
           const {rib,avs} = req.body;
           const uploadFileToCloudinary = async (file, folderName) => {
            if (file) {
              const result = await cloudinary.uploader.upload(file.path, {
                resource_type: 'auto',
                folder: folderName,
                public_id: `${folderName}_${Date.now()}`,
                overwrite: true,
              });
              console.log(result);
              return result.secure_url;
            }
            return null;
          };
const {simulationfile} = req.files;
          const missionInfo  = req.body;
  const query = { userId: req.user.id };

        const update = {
            $set: {
                [`missionInfo.profession.value`]: missionInfo.metier,
                [`missionInfo.industrySector.value`]: missionInfo.secteur,
                [`missionInfo.finalClient.value`]: missionInfo.client,
                [`missionInfo.dailyRate.value`]: missionInfo.tjm,
                [`missionInfo.startDate.value`]: missionInfo.debut,
                [`missionInfo.endDate.value`]: missionInfo.fin,
                [`missionInfo.isSimulationValidated.value`]: await uploadFileToCloudinary(simulationfile, 'isSimulationValidated'),
                [`status`]:'PENDING',

            }
        };

        const options = { new: true, upsert: true };

        const updatedPreRegistration = await preRegistrationModel.findOneAndUpdate(query, update, options);
console.log(updatedPreRegistration)

        return res.status(200).json(updatedPreRegistration);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

const getPreregistration = async (req, res) => {
    try {
        const preRegistration = await preRegistrationModel.findOne({ userId: req.user.id });
        return res.status(200).json(preRegistration);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

const getPendingPreregistration = async (req, res) => {
    try {
        const preRegistration = await preRegistrationModel.find({ status: 'PENDING' });
        return res.status(200).json(preRegistration);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}


const getConsultantStats = async (req, res) => {
    try {
        const users = await userModel.find({ role: 'CONSULTANT' });

        let numberOfConsultants = users.length;
        let numberOfMissions = 0;
        let totalTJM = 0;
        let totalRevenue = 0;

        const today = new Date();
        const startOfYear = moment().startOf('year').toDate();

        users.forEach(user => {
            if (user.missions && user.missions.length > 0) {
                user.missions.forEach(mission => {
                    numberOfMissions++;
                    const startDate = new Date(mission.missionInfo.startDate);
                    const endDate = new Date(mission.missionInfo.endDate);

                    if (startDate <= today && today <= endDate) {
                        const tjm = mission.missionInfo.dailyRate;
                        totalTJM += tjm;

                        if (startDate >= startOfYear) {
                            totalRevenue += tjm;
                        }
                    }
                });
            }
        });

        console.log(numberOfMissions)
        const averageTJM = numberOfMissions > 0 ? totalTJM / numberOfMissions : 0;

        return res.status(200).json({
            numberOfConsultants: numberOfConsultants,
            averageTJM: averageTJM,
            totalRevenue: totalRevenue
        });
    } catch (error) {
        console.error('Erreur lors du calcul des statistiques des consultants :', error);
        return res.status(500).json({ message: 'Erreur interne du serveur' });
    }
}








module.exports = {
    createPreRegistration1,
    createPreRegistration2,
    createPreRegistration3,
    getPreregistration,
    getPendingPreregistration,
    getConsultantStats
}