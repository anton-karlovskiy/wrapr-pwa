
const Validator = require('validator');

const isEmpty = require('./is-empty');

module.exports = function validateLoginInput(data) {
    let errors = {};

    if(Validator.isEmpty(data.email)) {
        errors.email = 'Email is required';
    }

    if(!Validator.isEmail(data.email)) {
        errors.email = 'Email is invalid';
    }
    
    if(Validator.isEmpty(data.password)) {
        errors.password = 'Password is required';
    }

    if(!Validator.isLength(data.password, {min: 6, max: 30})) {
        errors.password = 'Password must have more than 6 chars';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}