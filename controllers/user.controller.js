const User = require('../models/user.model');
const objectConverter = require('../utils/objectConverter');
const constants = require('../utils/constants');

exports.findAllUser = async (req, res) => {
    try{

        const queryObj = {};

        if(req.query.userType){
            queryObj.userType = req.query.userType
        }

        if(req.query.userStatus){
            queryObj.userStatus = req.query.userStatus
        }

        const users = await User.find(queryObj);

        res.status(200).send(objectConverter.userResponse(users))

    }catch(err){
        console.log("Error in find all user in user controller : ", err.message)
        res.status(500).send({
            message : "Internal Server Error !!!"
        })
    }
};

exports.findByUserId = async (req, res) => {
    try{

        const user = await User.find({userId : req.params.id});
        res.status(200).send(objectConverter.userResponse(user))

    }catch(err){
        console.log("Erroe in find by user id :", err.message);
        res.status(500).send({
            message : "Internal Server Error"
        })
    }
}

exports.update = async (req, res) => {
    try{

        const user = await User.findOne({userId : req.params.id});

        user.userType = req.body.userType != undefined ? req.body.userType : user.userType;
        user.userStatus = req.body.userStatus != undefined ? req.body.userStatus : user.userStatus;
        user.name = req.body.name != undefined ? req.body.name : user.name

        const updatedUser = await user.save();
        res.status(200).send({
            name : updatedUser.name,
            userId : updatedUser.userId,
            email : updatedUser.email,
            userType : updatedUser.userType,
            userStatus : updatedUser.userStatus
        })

    }catch(err){
        console.log("erroe in updating user data : ", err.message);
        res.status(500).send({
            message : "Internal server error"
        })
    }
}