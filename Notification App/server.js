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
            subject : "Test Email",
            recepientEmail : "bhoumik.dipu@gmail.com",
            content : "Hello !! i am a atest email created bt manually"
        }

        const notification = await Notification.create(notificationObj);
        console.log(notification)

    }catch(err){
        console.log("Error while inserting data into database manually for notification : " + err)
    }
};

console.log(serverConfig)

app.listen(serverConfig.PORT, () => {
    console.log("Server is Runing at Port : " + serverConfig.PORT)
})