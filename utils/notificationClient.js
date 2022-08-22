const Client = require('node-rest-client').Client;
const client = new Client();
const serverConfig = require('../configs/server.config');


module.exports = (subject, recepients, content, requester) => {
    
    const reqBody = {
        subject : subject,
        recepientEmails : recepients,
        content : content,
        requester : requester
    }

    const reqHeader = {
        "Content-Type" :  serverConfig.CONTENT_TYPE
    }

    const args = {
        data : reqBody,
        headers : reqHeader
    }

    try{
        client.post(serverConfig.NOTIFICATION_REQ_URL, args, (data, res) => {
            console.log(data);
            console.log("SUCCESS !! Request SENT !!!")
        })

    }catch(err){
        console.log("Error in notification client into util file : ", err.message)
    }
    
}

