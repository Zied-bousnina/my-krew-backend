const mongoose = require('mongoose');
mongoose.set("strictQuery", false);



const notificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    action : {
        type: String,
        required: true,

    },
    details : {
        type: String,
        required: true,
    },
    pathurl: {
        type: String,
        required: true,
    },
    idToPath :  {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    consultanName:{
        type: String,


    },
    consultantEmail:{
        type: String,

    },





}
,{
    timestamps: true,
  });

module.exports = mongoose.model("notification", notificationSchema);