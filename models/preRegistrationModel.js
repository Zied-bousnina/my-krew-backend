const mongoose = require("mongoose");
mongoose.set("strictQuery", false);



const preRegistartionSchema = mongoose.Schema({

    userId:String,
    personalInfo: {
        firstName: {
            value: String,
             validated: {
                type: Boolean,
                default: true, // Set the default value to true
            },
            causeNonValidation:String,
        },
        lastName: {
            value: String,
             validated: {
                type: Boolean,
                default: true, // Set the default value to true
            },
            causeNonValidation:String
        },
        email: {
            value: String,
             validated: {
                type: Boolean,
                default: true, // Set the default value to true
            },
            causeNonValidation:String
        },
        phoneNumber: {
            value: String,
             validated: {
                type: Boolean,
                default: true, // Set the default value to true
            },
            causeNonValidation:String
        },
        dateOfBirth: {
            value: String,
             validated: {
                type: Boolean,
                default: true, // Set the default value to true
            },
            causeNonValidation:String
        },
        location: {
            value: String,
             validated: {
                type: Boolean,
                default: true, // Set the default value to true
            },
            causeNonValidation:String
        },
        nationality: {
            value: String,
             validated: {
                type: Boolean,
                default: true, // Set the default value to true
            },
            causeNonValidation:String
        },
        socialSecurityNumber: {
            value: String,
             validated: {
                type: Boolean,
                default: true, // Set the default value to true
            },
            causeNonValidation:String
        },
        identificationDocument: {
            value: String,
             validated: {
                type: Boolean,
                default: true, // Set the default value to true
            },
            causeNonValidation:String
        },
        rib: {
            value: String,
             validated: {
                type: Boolean,
                default: true, // Set the default value to true
            },
            causeNonValidation:String
        },
        ribDocument: {
            value: String,
             validated: {
                type: Boolean,
                default: true, // Set the default value to true
            },
            causeNonValidation:String
        },
        carInfo: {
            hasCar: {
                value: Boolean,
                 validated: {
                type: Boolean,
                default: true, // Set the default value to true
            },
                causeNonValidation:String
            },
            drivingLicense: {
                value: String,
                 validated: {
                type: Boolean,
                default: true, // Set the default value to true
            },
                causeNonValidation:String
            },
            carRegistration: {
                value: String,
                 validated: {
                type: Boolean,
                default: true, // Set the default value to true
            },
                causeNonValidation:String
            },
        },
    },
    clientInfo: {
        company: {
            value: String,
             validated: {
                type: Boolean,
                default: true, // Set the default value to true
            },
            causeNonValidation:String
        },
        clientContact: {
            firstName: {
                value: String,
                 validated: {
                type: Boolean,
                default: true, // Set the default value to true
            },
                causeNonValidation:String
            },
            lastName: {
                value: String,
                 validated: {
                type: Boolean,
                default: true, // Set the default value to true
            },
                causeNonValidation:String
            },
            position: {
                value: String,
                 validated: {
                type: Boolean,
                default: true, // Set the default value to true
            },
                causeNonValidation:String
            },
            email: {
                value: String,
                 validated: {
                type: Boolean,
                default: true, // Set the default value to true
            },
                causeNonValidation:String
            },
            phoneNumber: {
                value: String,
                 validated: {
                type: Boolean,
                default: true, // Set the default value to true
            },
                causeNonValidation:String
            },
        },
    },
    missionInfo: {
        profession: {
            value: String,
             validated: {
                type: Boolean,
                default: true, // Set the default value to true
            },
            causeNonValidation:String
        },
        industrySector: {
            value: String,
             validated: {
                type: Boolean,
                default: true, // Set the default value to true
            },
            causeNonValidation:String
        },
        finalClient: {
            value: String,
             validated: {
                type: Boolean,
                default: true, // Set the default value to true
            },
            causeNonValidation:String
        },
        dailyRate: {
            value: Number,
             validated: {
                type: Boolean,
                default: true, // Set the default value to true
            },
            causeNonValidation:String
        },
        startDate: {
            value: Date,
             validated: {
                type: Boolean,
                default: true, // Set the default value to true
            },
            causeNonValidation:String
        },
        endDate: {
            value: Date,
             validated: {
                type: Boolean,
                default: true, // Set the default value to true
            },
            causeNonValidation:String
        },
        isSimulationValidated: {
            value: String,
             validated: {
                type: Boolean,
                default: true, // Set the default value to true
            },
            causeNonValidation:String
        },
        missionKilled: {
            type: Boolean,
            default: false
        },
        status: {
            type: String,
            enum: [ 'PENDING','WORKINGONIT' ,'VALID', 'REJECTED', 'COMPLETED'],
            default: 'PENDING',
        },
    },
    addedDate: {
        type: Date,
        default: Date.now,
    },
    pendingToKillDate: {
        type: Date,
    },
    status: {
        type: String,
        enum: ['VALIDATED', 'PENDING', 'NOTVALIDATED','NOTEXIST', 'PENDINGTOKILL'],
        default: 'NOTEXIST',
    },
    contractProcess: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'contractProcess'
    },
    validationRH: {
        type: String,
        enum: ['VALIDATED', 'PENDING', 'NOTVALIDATED'],
        default: 'PENDING',
    },
    validateClient: {
        type: String,
        enum: ['VALIDATED', 'PENDING', 'NOTVALIDATED'],
        default: 'PENDING',
    },
    validateContractWithClient : {
        type: String,
        enum: ['VALIDATED', 'PENDING', 'NOTVALIDATED'],
        default: 'PENDING',

    },
    validateContractTravail : {
        type: String,
        enum: ['VALIDATED', 'PENDING', 'NOTVALIDATED'],
        default: 'PENDING',
    },
    transmissionContract :  {
        type: String,
        enum: ['VALIDATED', 'PENDING', 'NOTVALIDATED'],
        default: 'PENDING',
    },
    noteAuClient :  {
        type: String,

    },
}
,{
    timestamps: true,
  });

module.exports = PreRegistration = mongoose.model("preRegistartion", preRegistartionSchema);