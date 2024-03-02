const isEmpty = require("./isEmpty")

const validator = require('validator')




module.exports = function RHvalidation(data) {
    let errors = {}

    data.email = !isEmpty(data.email) ? data.email : ""
    data.firstName = !isEmpty(data.firstName) ? data.firstName : ""
    data.lastName = !isEmpty(data.lastName) ? data.lastName : ""
    data.phoneNumber = !isEmpty(data.phoneNumber) ? data.phoneNumber : ""


    // if (!validator.isLength(data.firstName, { min: 2, max: 30 })) {
    //     errors.firstName = "firstName must be between 2 and 30 characters"
    // }

    if (validator.isEmpty(data.email)) {
        errors.email = "Email field is required"
    }
    if (!validator.isEmail(data.email)) {
        errors.email = "Email is invalid"
    }


    if (validator.isEmpty(data.firstName)) {
        errors.firstName = "firstName field is required"
    }
    if (validator.isEmpty(data.lastName)) {
        errors.lastName = "lastName field is required"
    }

    if (validator.isEmpty(data.phoneNumber)) {
        errors.phoneNumber = "phoneNumber field is required"
    }




    // if (errors.length > 0) {
    //     return {
    //         errors,
    //         isValid: isEmpty(errors)
    //     }
    // }
    return {
        errors,
        isValid: isEmpty(errors)
        }


}

