
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const serverConfig = require('../configs/server.config');
const constants = require('../utils/constants');


const verifyToken = (req, res, next) => {
    try{

    const token = req.headers["x-access-token"]

    if(!token){

        return res.status(403).send({
            message : "Failed !! Token is not Provided !!!"
        })
    }

    jwt.verify(token, serverConfig.SECRET_KEY, (err, decoded) => {

        if(err){
            return res.status(401).send({
                message : "UnAuthorized"
            })
        }
        req.userId = decoded.id  // I am taking the user Id from token and settign it in request object
        next()
    })

    }catch(err){
        console.log("Error in token valodation")
        res.status(500).send("Internal server error")
    }
    
};

const isAdmin = async (req, res, next) => {
    try{

        const user = await User.findOne({userId : req.userId});

        if(user && user.userType == constants.userType.admin){
            next()

        }else{

            return res.status(403).send({
                message : "Failed !! Only ADMIN can access this endpoint !!!"
            })
        }

    }catch(err) {
        console.log("Error in isAdmin valodation")
        res.status(500).send("Internal server error")
    }
}

const isValidUserIdInParams = async (req, res, next) => {
    try{

        const user = await User.find({userId : req.params.id});

        if(user.length == 0){
            return res.status(400).send({
                message : "UserId passed doesn't exists"
            })
        }

        next()

    }catch(err){
        console.log("error in validation userid in params ");
        res.status(500).send({
            message : "Internal Server Error"
        })
    }
};

const isAdminOrOwner = async (req, res, next) => {
    try{
        const user = await User.findOne({userId : req.userId});
        if(user.userType == constants.userType.admin || user.userId == req.params.id){
            next()
        }else{
            return res.status(403).send({
                message : "Only Admin and Owner can make this call"
            })
        }

    }catch(err){
        console.log("error in validation userid in params ");
        res.status(500).send({
        message : "Internal Server Error"
        })
    }
}

const validateUserTypeAndUserStatusUpdateRequest = async (req, res, next) => {
    try{

        const user = await User.findOne({userId : req.userId});


        if((req.body.userType || req.body.userStatus) && user.userType != constants.userType.admin){
            
            return res.status(403).send({
                message : "Only Admin can Update the data"
            })
        }
        next()

    }catch(err){
        console.log("error in validation validateUserTypeAndUserStatusUpdateRequest in params ");
        res.status(500).send({
        message : "Internal Server Error"
        })
    }
}



const authRequestValidator = {
    verifyToken : verifyToken,
    isAdmin : isAdmin,
    isAdminOrOwner : isAdminOrOwner,
    isValidUserIdInParams : isValidUserIdInParams,
    validateUserTypeAndUserStatusUpdateRequest : validateUserTypeAndUserStatusUpdateRequest
}

module.exports = authRequestValidator;