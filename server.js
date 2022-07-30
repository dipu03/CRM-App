const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const bcrypt = require('bcryptjs')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));


const serverConfig = require('./configs/server.config')
const User = require('./models/user.model');
const Ticket = require('./models/ticket.model');
const constants = require('./utils/constants')

// connectiong with mongoDB
mongoose.connect(serverConfig.DB_URL);
const db = mongoose.connection;
db.on("error", () => {
    console.log("Error While connecting with mongoDB")
})
db.once("open", () => {
    console.log("Connection Established with mongoDB")
    init()
})

async function init(){
    try{

        await User.collection.drop();
        await Ticket.collection.drop();
    
        let  user = await User.findOne({userType : constants.userType.admin});
        if(user){
            console.log(user);
            console.log("Admin user is already created")
            return
        }
    
        user = await User.create({
            name : "Dipankar Bhoumik",
            userId : "dipu",
            password : bcrypt.hashSync("dipu97", 10),
            email : "bhoumik.dipu@gmail.com",
            userType : constants.userType.admin,
            userStatus : constants.userStatus.approved
        })
    
        console.log(user);

    }catch(err){
        console.log("Error while inserting data into database manually : " + err)
    }
};



// Require all routes
require('./routes/ticket.route')(app)
require('./routes/user.route')(app);
require('./routes/auth.route')(app);


app.listen(serverConfig.PORT, () => {
    console.log("Server is runing ar PORT : " + serverConfig.PORT)
})



