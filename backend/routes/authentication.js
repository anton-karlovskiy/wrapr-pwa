
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const validateRegisterInput = require('../validation/register');
const validateLoginInput = require('../validation/login');
const validateForgotPasswordInput = require('../validation/forgot-password');
const validateResetPasswordInput = require('../validation/reset-password');

const { User } = require('../models/user');
const utils = require('../utils');
const { sendEmail } = require('../services/email-service');

exports.register = function (req, res) {
    const { errors, isValid } = validateRegisterInput(req.body);

    // check input validation
    if (!isValid) {
        return res.status(400).json(errors);
    }

    // check if already exists
    User.findOne({
        email: req.body.email
    }).then(user => {
        if (user) {
            return res.status(400).json({
                email: 'Email already exists'
            });
        } else {
            // TODO: avatar logic not completed
            const avatar = gravatar.url(req.body.email, {
                s: '200',
                r: 'pg',
                d: 'mm'
            });

            const newUser = new User({
                _id: utils.generateRandomId(),
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                avatar
            });

            bcrypt.genSalt(10, (error, salt) => {
                if (error) {
                    console.error('mars: there was an error', error);
                } else {
                    bcrypt.hash(newUser.password, salt, (error, hash) => {
                        if (error) {
                            console.error('mars: there was an error', error);
                        } else {
                            newUser.password = hash;
                            newUser
                                .save()
                                .then(user => {
                                    res.json(user);
                                })
                                .catch(error => {
                                    // TODO: error handling to frontend
                                    console.error('ray : [routes authentication user.save] error => ', error);
                                });
                        }
                    });
                }
            });
        }
    });
}

exports.login = function (req, res) {
    const { errors, isValid } = validateLoginInput(req.body);

    if(!isValid) {
        return res.status(400).json(errors);
    }

    const email = req.body.email;
    const password = req.body.password;

    User.findOne({email})
        .then(user => {
            if(!user) {
                errors.email = 'User not found!';
                return res.status(404).json(errors);
            }
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if(isMatch) {
                        const payload = utils.getUserPayload(user);
                        jwt.sign(payload, 'secret', {
                            expiresIn: '6h'
                        }, (error, token) => {
                            if(error) {
                                console.error('there are some errors in token', error);
                            }
                            else {
                                res.json({
                                    id: user._id,
                                    success: true,
                                    token: `Bearer ${token}`
                                });
                            }
                        });
                    }
                    else {
                        errors.password = 'Incorrect Password!';
                        return res.status(400).json(errors);
                    }
                });
        });
}

exports.me = function (req, res) {
    return res.json({
        user: utils.getUserPayload(req.user)
    });
}

exports.forgotPassword = function (req, res) {
    const { errors, isValid } = validateForgotPasswordInput(req.body);

    if(!isValid) {
        return res.status(400).json(errors);
    }

    const email = req.body.email;
    const resetUrl = req.body.resetUrl;
    User.findOne({email})
        .then(async user => {
            if(!user) {
                errors.email = 'User not found, Register now.'
                return res.status(404).json(errors);
            }
            
            const token = crypto.randomBytes(20).toString('hex');
            const subject = 'Link To Reset Password';
            const text = 
                'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n'
                + 'Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n'
                + `${resetUrl}?token=${token}\n\n`
                + 'If you did not request this, please ignore this email and your password will remain unchanged.\n';
            try {
                await sendEmail(email, subject, text);
                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 3600000;
                await user.save();
                res.status(200).json({
                    message: 'Password Reset Email Successfully Sent!'
                });
            } catch (error) {
                // TODO: error handling to frontend
                console.log('ray : error => ', error);
            }
        });
}

exports.checkResetPassword = function (req, res) {
    let errors = {};
    User.findOne({resetPasswordToken: req.query.resetPasswordToken})
        .then(user => {
            if(!user) {
                errors.message = 'No user exists to update password.';
                return res.status(404).json(errors);
            }
            if (user.resetPasswordExpires < Date.now()) {
                errors.message = 'Password reset link has expired. Please send another reset link.';
                return res.status(403).json(errors);
            }

            res.status(200).json({
                email: user.email
            });
        });
}

exports.resetPassword = function (req, res) {
    const { errors, isValid } = validateResetPasswordInput(req.body);

    if(!isValid) {
        return res.status(400).json(errors);
    }

    const email = req.body.email;
    const password = req.body.password;
    const resetPasswordToken = req.body.resetPasswordToken;

    User.findOne({email, resetPasswordToken})
        .then(user => {
            if(!user) {
                errors.message = 'No user exists to update password.';
                return res.status(404).json(errors);
            }

            bcrypt.genSalt(10, (error, salt) => {
                if (error) {
                    console.error('mars: there was an error', error);
                } else {
                    bcrypt.hash(password, salt, (error, hash) => {
                        if (error) {
                            console.error('mars: there was an error', error);
                        } else {
                            user.password = hash;
                            user.resetPasswordToken = null;
                            user.resetPasswordExpires = null;
                            user.save()
                                .then(user => {
                                    res.status(200).json({
                                        message: 'Password updated!'
                                    });
                                })
                                .catch(error => {
                                    // TODO: error handling to frontend
                                    console.error('ray : [routes authentication user.save] error => ', error);
                                });
                        }
                    });
                }
            });
        });
}
