const isEmpty = require("./isEmpty")

const validator = require('validator')

module.exports = function preregistrationStep1Validation(data) {
    let errors = {}
    data.firstName = !isEmpty(data.firstName)? data.firstName : ""
    data.lastName = !isEmpty(data.lastName)? data.lastName : ""
    // data.dateOfBirth = !isEmpty(data.dateOfBirth)? data.dateOfBirth : ""
    data.email = !isEmpty(data.email)? data.email : ""
    data.phoneNumber = !isEmpty(data.phoneNumber)? data.phoneNumber : ""
    data.location = !isEmpty(data.location)? data.location : ""
    data.nationality = !isEmpty(data.nationality) ? data.nationality : ""

    // data.bio = !isEmpty(data.bio)? data.bio : ""

    if (validator.isEmpty(data.firstName)) {
        errors.firstName = "firstName field is required"
    }
    if (validator.isEmpty(data.lastName)) {
        errors.lastName = "lastName field is required"
    }
    // if (validator.isEmpty(data.dateOfBirth)) {
    //     errors.dateOfBirth = "dateOfBirth field is required"
    // }
    if (validator.isEmpty(data.email)) {
        errors.email = "email field is required"
    }
    if (validator.isEmpty(data.phoneNumber)) {
        errors.phoneNumber = "phoneNumber field is required"
    }
    if (validator.isEmpty(data.location)) {
        errors.location = "location field is required"
    }
    if (validator.isEmpty(data.nationality
    )) {
        errors
        .nationality
        = "nationality field is required"
    }

    // if (validator.isEmpty(data.bio)) {
    //     errors.bio = "Bio field is required"
    // }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}


