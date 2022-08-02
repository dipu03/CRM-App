const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));
const mongoose = require('mongoose');
const serverConfig = require('./configs/server.config');
const Notification = require('./models/notification.model');



mongoose.connect(serverConfig.DB_URL);
const db = mongoose.connection;
db.on("error" ,() =>{
    console.log("Error !! Failed to Connect with mongoDB")
})
db.on("open", () => {
    console.log("Success !! Connection established Successfully with mongoDb")
    init()
})


async function init(){
    try{

        await Notification.collection.drop();

        const notificationObj = {
            subject : "Test Email by Admin",
            recepientEmails : "bhoumik.dipu@gmail.com,bhoumik.dipu03121997@gmail.com",
            requester : "Dipankar Bhoumik",
            content : "Hello !! this is a test email created by admin manually",
            notificationStatus : "UN_SENT"
        }

        const notification = await Notification.create(notificationObj);
        console.log(notification)

    }catch(err){
        console.log("Error while inserting data into database manually for notification : " + err)
    }
};

require('./schedulars/emailSchedular')
require('./routes/notification.route')(app)
app.listen(serverConfig.PORT, () => {
    console.log("Server is Runing at Port : " + serverConfig.PORT)
})