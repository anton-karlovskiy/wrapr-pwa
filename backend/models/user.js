const mongoose = require('mongoose');

// create a Mongoose schema
const UserSchema = new mongoose.Schema({
    _id: { 
        type: String
    },

    name: {
        type: String,
        required: true
    },
    
    email: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    },

    role: {
        admin: {
            type: Boolean,
            default: false
        },
        videoSubscriber: {
            type: Boolean,
            default: false
        },
        animationClubSubscriber: {
            type: Boolean,
            default: false
        }
    },

    avatar: {
        type: String
    },

    date: {
        type: Date,
        default: Date.now
    },

    resetPasswordToken: {
        type: String
    },

    resetPasswordExpires: {
        type: Number
    },

    stripe: {
        customerId: {
            type: String,
            default: null
        },
        planId: {
            type: String,
            default: null
        },
        latestInvoiceId: {
            type: String,
            default: null
        },
        subscriptionId: {
            type: String,
            default: null
        },
        paymentIntentStatus: {
            type: String,
            default: null
        },
        subscriptionStatus: {
            type: String,
            default: null
        }
    }
});

const User = mongoose.model('users', UserSchema);
exports.User = User;