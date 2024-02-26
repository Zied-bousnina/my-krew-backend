const mongoose = require('mongoose');
mongoose.set("strictQuery", false);

const type = ['Participation','Cooptation','Frais'];

const virementSchema = new mongoose.Schema({
    userId: {
        type: String,
    },
    typeVirement: {
        type: String,
        enum: type,
    },
    montant:{
        type: Number,
    },




},{
    timestamps: true,
  }
  );

module.exports = mongoose.model("virement", virementSchema);