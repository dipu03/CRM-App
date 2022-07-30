const mongoose = require('mongoose');
const constants = require('../utils/constants');


const ticketSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true
    },
    ticketPriority : {
        type : Number,
        required : true,
        default : 4
    },
    description : {
        type : String,
        required : true
    },
    reporter : {
        type : String,
        required : true
    },
    assignee : {
        type : String
    },
    ticketStatus : {
        type : String,
        default : constants.ticketStatus.open,
        enum : [constants.ticketStatus.open, constants.ticketStatus.close, constants.ticketStatus.blocked]
    },
    createdAt : {
        type : Date,
        immutable : true,
        default : () => {
            return Date.now()
        }
    },
    updatedAt : {
        type : Date,
        default : () => {
            return Date.now()
        }
    }
}, { versionKey : false })

module.exports = mongoose.model("ticket", ticketSchema);

/**
 * {versionKey : false} not to create __v by mongoose for documents
*/