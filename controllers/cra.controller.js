const LogModel = require("../models/Log.model");
const contractModel = require("../models/contractModel");
const craModel = require("../models/craModel");
const cra = require("../models/craModel");
const cloudinary = require("../utils/uploadImage");

const createCra = async (req, res) => {
  // console.log(req)
  try {
    const craFile = await uploadFileToCloudinary(req.files.craFile, "cra");

    const newCra = new cra({
      userId: req.user.id,
      craFile: craFile,
      missionId: req.body.missionId,
    });
    const savedCra = await newCra.save();
    await new LogModel({
      userId: req.user.id,
      action: 'Création de CRA',
      details: `CRA pour la mission ${req.body.missionId} créé avec succès.`,
    }).save();

    return res.status(201).json({
      action: "cra.controller.js/createCra",
      status: "success",
      data: savedCra,
    });
  } catch (error) {

    return res.status(500).json({
      action: "cra.controller.js/createCra",
      status: "error",
      message: "Internal Server Error",
    });
  }
};

const craAlreadyCreatedForCurrentMonth = async (req, res) => {
  try {
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    const findedCra = await cra.find({
      userId: req.user.id,
      missionId: req.params.id,
      status: { $in: ["VALIDATED", "PENDING"] },
      createdAt: {
        $gte: new Date(`${currentYear}-${currentMonth}-01`),
        $lt: new Date(`${currentYear}-${currentMonth}-31`),
      },
    });
    return res.status(200).json({
      action: "cra.controller.js/craAlreadyCreatedForCurrentMonth",
      status: "success",
      data: findedCra,
    });
  } catch (error) {

    return res.status(500).json({
      action: "cra.controller.js/craAlreadyCreatedForCurrentMonth",
      status: "error",
      message: "Internal Server Error",
    });
  }
};

const GetCraByMissionId = async (req, res) => {
  // console.log(req)
  try {
    const missionId = req.params.missionId;

    // Assuming your cra model is named "craModel"
    const cra = await craModel.findOne({ missionId: missionId }) .populate({
      path: 'userId',
      populate: {
        path: 'preRegister',
        // You can specify additional options for populating the 'preRegister' field here if needed
      }
    }).populate("contractProcess");;

    if (!cra) {
      return res.status(404).json({ error: "Cra not found for the given missionId" });
    }

    return res.status(200).json({ cra: cra });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const validateCRA = async (req, res) => {
  try {
    const { status } = req.body;

    const CRA = await craModel.findById(req.params.id );

    if (!CRA) {
      return res.status(404).json({ message: "CRA non trouvée" });
    }
    console.log(status)

    CRA.status = status == "Validée" ? "VALIDATED" : status == "En cours" ? "PENDING" : status == "refusé" ? "NOTVALIDATED" : "NOTVALIDATED";

    await CRA.save();
    await new LogModel({
      userId: req.user.id,
      action: 'CRA Validé',
      details: `Le statut du CRA avec l'ID ${req.params.id} a été mis à jour vers '${status}'.`,
    }).save();
    console.log(CRA)

    return res.status(200).json(CRA);
  } catch (error) {
    console.error("Erreur lors de la validation des informations du client de la pré-inscription :", error);
    return res.status(500).json({ message: "Erreur interne du serveur" });
  }
};




module.exports = {
  createCra,
  craAlreadyCreatedForCurrentMonth,
  GetCraByMissionId,
  validateCRA
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
