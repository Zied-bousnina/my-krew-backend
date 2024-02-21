const cra = require("../models/craModel");
const cloudinary = require("../utils/uploadImage");


const createCra = async (req, res) => {
  try {
    const craFile= await uploadFileToCloudinary(req.files.craFile, "cra")

    const newCra = new cra({
      userId: req.user.id,
      craFile: craFile,
    });
    const savedCra = await newCra.save();
    return res.status(201).json({
      action: "cra.controller.js/createCra",
      status: "success",
      data: savedCra,
    });
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      action: "cra.controller.js/createCra",
      status: "error",
      message: "Internal Server Error",
    });
  }
};

module.exports = {
    createCra,
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
