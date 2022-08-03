const Notification = require('../models/notification.model');
const cron = require('node-cron');
const constants = require('../utils/constants');
const emailTransporter = require('../notifiers/emailServer');


cron.schedule("*/10 * * * * * ", async () => {
    try{

        const notifications = await Notification.find({notificationStatus : constants.notificationStatus.un_sent});

        if(notifications){
            notifications.forEach(n => {

                const notificationObj = {
                    to : n.recepientEmails,
                    subject : n.subject,
                    text : n.content
                }

                emailTransporter.sendMail(notificationObj, async (err, info) => {
                    if(err){
                        console.log("Error in sending email : ", err.message)
                    }else{
                        console.log("Successfully email send : ", info)

                        n.notificationStatus = constants.notificationStatus.sent;
                        await n.save()
                    }
                })
            })
        }

    }catch(err){
        console.log("Error in email schedular")
    }
})