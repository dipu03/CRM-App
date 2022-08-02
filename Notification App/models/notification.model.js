const mongoose = require('mongoose');
const constants = require('../utils/constants');

const notificationSchema = new mongoose.Schema({
    subject : {
        type : String,
        required : true
    },
    recepientEmails : {
        type : String,
        required : true
    },
    content : {
        type : String,
        required : true
    },
    requester : {
        type : String
    },
    createdAt : {
        type : Date,
        immutable : true,
        default : () => {
            return Date.now()
        }
    },
    updatedAtAt : {
        type : Date,
        default : () => {
            return Date.now()
        }
    },
    notificationStatus : {
        type : String,
        default : constants.notificationStatus.un_sent,
        enum : [constants.notificationStatus.sent, constants.notificationStatus.un_sent]
    }
});

module.exports = mongoose.model("notification", notificationSchema)
