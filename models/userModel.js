const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const bcrypt = require("bcryptjs");

const roles = ["CONSULTANT", "RH", "ADMIN"];
const newMissionStatus = ["PENDING", "VALIDATED", "NOTVALIDATED"];
const newTJMStatus = ["PENDING", "VALIDATED", "NOTVALIDATED"];

const userSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      default: "default.jpg",
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: roles,
      default: "CONSULTANT",
    },
    preRegister: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "preRegistartion",
      default: null,
    },
    missions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "newMission",
        default: null,
      },
    ],
    personalInfo: {
      immatriculation: String,
      firstName: String,
      lastName: String,
      email: String,
      phoneNumber: String,
      dateOfBirth: Date,
      location: String,
      nationality: String,
      socialSecurityNumber: String,
      identificationDocument: String,
      rib: String,
      ribDocument: String,
      carInfo: {
        hasCar: Boolean,
        drivingLicense: String,
      },
    },

    userDocuments: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          default: new mongoose.Types.ObjectId(),
        },
        documentName: String,
        document: String,
        createdAt: {
          type: Date,
          default: Date.now(),
        },
      },
    ],

    isBlocked: {
      type: Boolean,
      default: false
    },
    CreatedByAdmin :  {
      type: Boolean,
      default: false
    },

  },

  {
    timestamps: true,
  }
);
userSchema.methods.addMission = async function (missionData) {
  try {
    this.missions.push(missionData);
    await this.save();
    return this;
  } catch (error) {
    throw error;
  }
};

userSchema.methods.addPersonalInfo = async function (personalInfoData) {
  try {
    this.personalInfo = personalInfoData;
    await this.save();
    return this;
  } catch (error) {
    throw error;
  }
};

userSchema.methods.addDocument = async function (documentData) {
  try {
    this.userDocuments.push(documentData);
    await this.save();
    return this;
  } catch (error) {
    throw error;
  }
};

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
userSchema.methods.comparePassword = async function (password) {
  const result = await bcrypt.compareSync(password, this.password);
  return result;
};
module.exports = mongoose.model("user", userSchema);
