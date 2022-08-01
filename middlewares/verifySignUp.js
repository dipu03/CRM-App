const User = require('../models/user.model');
const constants = require('../utils/constants');

const validateSignUpRequestBody = async (req, res, next) => {
    try{

        if(!req.body.name || !req.body.userId || !req.body.email || !req.body.password || !req.body.userType){
            return res.status(400).send({
                message : "Failed !! Required Field missed !!  :- [name, userId, email, password, userType] can't be empty !!!!"
            })
        }

        const user = await User.findOne({userId : req.body.userId})
        if(user){
            return res.status(400).send({
                message : "Failed !! UserId is already taken  !!! Please try with another userId !!!"
            })
        }

        if(req.body.userType == constants.userType.admin){
            return res.status(400).send({
                message : "Failed !! ADMIN !! Registration is not available !!!"
            })
        }

        if(!isValidEmail(req.body.email)){
            return res.status(400).send({
                message : "Failed !! not a valid email !!!"
            })
        }

        if(!Object.values(constants.userType).includes(req.body.userType)){
            return res.status(400).send({
                message : "Failed !! UserType provided is not correct. Possible correct values : CUSTOMER | ENGINEER"
            })
        }


    }catch(err){
        console.log("Error in validateSignUpRequest section into middleware")
        res.status(500).send({
            message : "Internal Server Error"
        })
    }
    next()
};


function isValidEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

const validateSignInRequestBody = (req, res, next) => {

    if(!req.body.userId){
        return res.status(400).send({
            message : "Failed !! UserId is not Provided"
        })
    }

    if(!req.body.password){
        return res.status(400).send({
            message : "Failed !! Password is not Provided"
        })
    }

    next()
}

const verifyRequestBodyForAuth = {
    validateSignUpRequestBody : validateSignUpRequestBody,
    validateSignInRequestBody : validateSignInRequestBody
}

module.exports = verifyRequestBodyForAuth