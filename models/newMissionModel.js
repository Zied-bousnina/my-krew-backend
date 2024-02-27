const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const newMissionStatus = [
  "PENDING",
  "VALIDATED",
  "WAITINGCONTRACT",
  "NOTVALIDATED",
];

const newMissionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },

  clientInfo: {
    company: {
      value: String,
      validated: { type: Boolean, default: null },
      causeNonValidation: { type: String, default: null },
    },

    clientContact: {
      firstName: {
        value: String,
        validated: { type: Boolean, default: null },
        causeNonValidation: { type: String, default: null },
      },
      lastName: {
        value: String,
        validated: { type: Boolean, default: null },
        causeNonValidation: { type: String, default: null },
      },
      position: {
        value: String,
        validated: { type: Boolean, default: null },
        causeNonValidation: { type: String, default: null },
      },
      email: {
        value: String,
        validated: { type: Boolean, default: null },
        causeNonValidation: { type: String, default: null },
      },
      phoneNumber: {
        value: String,
        validated: { type: Boolean, default: null },
        causeNonValidation: { type: String, default: null },
      },
    },
  },
  missionInfo: {
    profession: {
      value: String,
      validated: { type: Boolean, default: null },
      causeNonValidation: { type: String, default: null },
    },
    industrySector: {
      value: String,
      validated: { type: Boolean, default: null },
      causeNonValidation: { type: String, default: null },
    },
    finalClient: {
      value: String,
      validated: { type: Boolean, default: null },
      causeNonValidation: { type: String, default: null },
    },
    simulation: {
      value: String,
      validated: { type: Boolean, default: null },
      causeNonValidation: { type: String, default: null },
    },
    dailyRate: {
      value: Number,
      validated: { type: Boolean, default: null },
      causeNonValidation: { type: String, default: null },
    },
    startDate: {
      value: Date,
      validated: { type: Boolean, default: null },
      causeNonValidation: { type: String, default: null },
    },
    endDate: {
      value: Date,
      validated: { type: Boolean, default: null },
      causeNonValidation: { type: String, default: null },
    },
    isSimulationValidated: {
      value: String,
      validated: { type: Boolean, default: null },
      causeNonValidation: { type: String, default: null },
    },
  },

  missionKilled: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ["PENDING", "WAITINGCONTRACT", "VALID", "REJECTED", "COMPLETED"],
    default: "PENDING",
  },
  contractProcess: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "contractProcess",
  },
});

module.exports = mongoose.model("newMission", newMissionSchema);
