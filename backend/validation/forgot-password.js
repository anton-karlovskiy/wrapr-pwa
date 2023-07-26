
const Validator = require('validator');

const isEmpty = require('./is-empty');

module.exports = function validateForgotPasswordInput(data) {
    let errors = {};

    if(Validator.isEmpty(data.email)) {
        errors.email = 'Email is required';
    }

    if(!Validator.isEmail(data.email)) {
        errors.email = 'Email is invalid';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}