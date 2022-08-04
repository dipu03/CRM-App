
module.exports = {
    userType : {
        customer : "CUSTOMER",
        engineer : "ENGINEER",
        admin : "ADMIN"
    },

    
    userStatus : {
        pending : "PENDING",
        approved : "APPROVED",
        rejected : "REJECTED"
    },

    ticketStatus : {
        open : "OPEN",
        close : "CLOSE",
        blocked : "BLOCKED"
    },

    isValidEmail : (email) => {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    },

    getEngineer : (engineers) => {
        
        let tempEng;
        let maxTicketAssigned = Number.MAX_SAFE_INTEGER;

        for(let engineer of engineers){
            if(engineer.ticketsAssigned.length < maxTicketAssigned){
                tempEng = engineer;
                maxTicketAssigned = engineer.ticketsAssigned.length
            }
        }
        return tempEng
    },

    mailCriteria : {
        OWNER_NAME : "CRM-APP",
        ADMIN_MAIL_ID : "bhoumik.dipu@gmail.com"
    }

}