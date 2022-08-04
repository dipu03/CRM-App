const Notification = require('../models/notification.model');

exports.acceptNotificationRequest = async (req, res) => {
    try{

        const notificationObj = {
            subject : req.body.subject,
            recepientEmails : req.body.recepientEmails,
            content : req.body.content,
            requester : req.body.requester,
            notificationStatus : req.body.notificationStatus
        }

        const notification = await Notification.create(notificationObj);

        res.status(201).send({
            message : "Notification Request Saved !!!",
            trackingId : notification._id
        })

    }catch(err){
        console.log("Error in accepting notification request : ", err.message)
        res.status(500).send("Internal Server Error !!!")
    }
}

exports.getNotificationDetailsById = async (req, res) => {
    try{

        const notificationId = req.params.id;
        if(!notificationId){
            return res.status(400).send({
                message : "Failed !! Notification_id is missed !!!"
            })
        }

        const notification = await Notification.findOne({_id : notificationId});

        if(!notification){
            return res.status(400).send({
                message : "Failed !! NotificationId is not valid"
            })
        }

        res.status(200).send(notification)

    }catch(err){
        console.log("Error in getNotificationDetailsById request : ", err.message)
        res.status(500).send("Internal Server Error !!!")
    }
}
