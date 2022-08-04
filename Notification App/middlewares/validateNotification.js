const constants = require('../utils/constants');

const validateNotificationBody = (req, res, next) => {
    try{
        console.log(req.body.subject, req.body.recepientEmails, req.body.content)

        if(!req.body.subject || !req.body.recepientEmails || !req.body.content){
            
            return res.status(400).send({
                message : "Failed !! [subject, recepientEmails, content] is required to make this call !!!"
            })
        }

        if(req.body.notificationStatus){

            if(req.body.notificationStatus == constants.notificationStatus.sent){
                return res.status(400).send({
                    message : "Failed !! Notification status provided Wrong !!!"
                })
            }
        }

        let arr = req.body.recepientEmails.split(',').map(elm => {
            return elm.trim()
        });

        for(let i=0; i<arr.length; i++){
            if(constants.isValidEmail(arr[i]) == false){
                return res.status(400).send({
                    message : "Failed !! recepientEmails invalid !!!"
                })
            }
            
        }
        next()

    }catch(err){
        console.log("error in validate notificaton body : " , err.message)
        res.status(500).send({
            message : "Internal Server Error"
        })
    }
}



const validateNotification = {
    validateNotificationBody : validateNotificationBody
}
module.exports = validateNotification
