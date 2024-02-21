const cra = require("../models/craModel");
const cloudinary = require("../utils/uploadImage");

const createCra = async (req, res) => {
  try {
    const craFile = await uploadFileToCloudinary(req.files.craFile, "cra");

    const newCra = new cra({
      userId: req.user.id,
      craFile: craFile,
      missionId: req.body.missionId,
    });
    const savedCra = await newCra.save();
    return res.status(201).json({
      action: "cra.controller.js/createCra",
      status: "success",
      data: savedCra,
    });
  } catch (error) {
    console.log(error);
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
    console.log(error);
    return res.status(500).json({
      action: "cra.controller.js/craAlreadyCreatedForCurrentMonth",
      status: "error",
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  createCra,
  craAlreadyCreatedForCurrentMonth,
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
