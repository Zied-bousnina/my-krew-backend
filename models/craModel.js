const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const status = ["PENDING", "VALIDATED", "NOTVALIDATED"];

const craSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
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
  createdAt: {
    type: Date,
    default: Date.now,
  },

});

module.exports = mongoose.model("cra", craSchema);
