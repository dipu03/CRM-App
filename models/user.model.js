const mongoose = require('mongoose');
const constants = require("../utils/constants")

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    userId : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    },
    email : {
        type : String,
        unique : true,
        required : true,
        minLength : 10,
        lowercase : true
    },
    createdAt : {
        type : Date,
        immutable : true,
        default : () => {
            return Date.now()
        }
    },
    updatedAtdAt : {
        type : Date,
        default : () => {
            return Date.now()
        }
    },
    userType : {
        type : String,
        required : true,
        default : constants.userType.customer,
        enum : [constants.userType.customer, constants.userType.admin, constants.userType.engineer]
    },
    userStatus : {
        type : String,
        required : true,
        default : constants.userStatus.approved,
        enum : [constants.userStatus.approved, constants.userStatus.pending, constants.userStatus.rejected]
    },
    ticketsCreated : {
        type : [mongoose.SchemaType.ObjectId],
        ref : "Ticket"
    },
    ticketsAssigned : {
        type : [mongoose.SchemaType.ObjectId],
        ref : "Ticket"
    }
})

module.exports = mongoose.model("user", userSchema);