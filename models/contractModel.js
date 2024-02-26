const mongoose = require('mongoose');
mongoose.set("strictQuery", false);


const status = ['DESACTIVATED','PENDING','VALIDATED','NOTVALIDATED'];

const contractProcessSchema = new mongoose.Schema({
    contactClient: {
        type: String,
        enum: status,
        default: "PENDING"
    },
    clientValidation: {
        type: String,
        enum: status,
        default: "PENDING"
    },
    jobCotractEdition: {
        type: String,
        enum: status,
        default: "PENDING"
    },
    contractValidation: {
        type: String,
        enum: status,
        default: "PENDING"
    },
    statut: {
        type: String,
        enum: status,
        default: "PENDING"
    },
});

module.exports = mongoose.model("contractProcess", contractProcessSchema);