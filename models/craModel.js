const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const status = ["PENDING", "VALIDATED", "NOTVALIDATED"];

const craSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  missionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "newMission",
  },
  craFile: {
    type: String,
    default:"default.pdf"
  },
  status: {
    type: String,
    enum: status,
    default: "PENDING",
  },


}
,{
  timestamps: true,
});

module.exports = mongoose.model("cra", craSchema);
