const User = require('../models/user.model');
const Ticket = require('../models/ticket.model');
const constants = require('../utils/constants');
const sendNtificationReq = require('../utils/notificationClient');
const createContent = require('../utils/emailContent');

exports.createTicket = async (req, res) => {
    try{

        const ticketObj = {
            title : req.body.title,
            ticketPriority : req.body.ticketPriority,
            description : req.body.description,
            ticketStatus : req.body.ticketStatus,
            reporter : req.userId
        }

        let engineer;
        const engineers = await User.find({
            userType : constants.userType.engineer,
            userStatus : constants.userStatus.approved
        })

        if(engineers.length != 0){
            engineer = constants.getEngineer(engineers)
            ticketObj.assignee = engineer.userId
        }

        const ticket = await Ticket.create(ticketObj)

        if(ticket){

            // update ticket in reporter's document
            const user = await User.findOne({userId : ticket.reporter});

            user.ticketsCreated.push(ticket._id)
            await user.save()


            // update ticket in assignee's document
            if(engineer){
                engineer.ticketsAssigned.push(ticket._id);
                await engineer.save()
            }

            const reporter = await User.findOne({userId : ticket.reporter});
            const assignee = await User.findOne({userId : ticket.assignee});
            
            // send email 
            sendNtificationReq(`Ticket Created Successfully !!! Id : ${ticket._id}`,`${reporter.email},${assignee.email},${constants.mailCriteria.ADMIN_MAIL_ID}`,`Yeahhh !! Your Ticket is Created Successfully !!! ${'\n'} Ticket_id :  ${ticket._id} ${'\n'} Ticket_status :  ${ticket.ticketStatus} ${'\n'} Ticket_description : ${ticket.description}`, `${constants.mailCriteria.OWNER_NAME}`)

            res.status(201).send(ticket)
        }

    }catch(err){
        console.log("Error in ticket creation controller : ", err.message);
        res.status(500).send({
            message : "Internal Server Error"
        })
    }
};


exports.findAllTickets = async (req, res) => {
    try{

        const user  = await User.findOne({userId : req.userId});
        const queryObj = {}

        if(user){

            const ticketsCreatedByUser = user.ticketsCreated;
            const ticketsAssignedToEngineer = user.ticketsAssigned;

            // For Customer
            if(user.userType == constants.userType.customer){

                if(ticketsCreatedByUser.length == 0){
                    return res.status(200).send({
                        message : "Failed !! No Ticket are created Yet !!!"
                    })
                }
                queryObj._id = {$in : ticketsCreatedByUser};

                const tickets = await Ticket.find(queryObj);
                res.status(200).send(tickets)
            }


            // For Engineer
            else if(user.userType == constants.userType.engineer){



                if(ticketsCreatedByUser.length == 0){
                    return res.status(200).send({
                        message : "Failed !! No Tickets are created Yet !!!"
                    })
                }

                if(ticketsAssignedToEngineer.length == 0){
                    return res.status(200).send({
                        message : "Failed !! No Tickets are assigned Yet !!!"
                    })
                }

                queryObj["$or"] = [{"_id" : {$in : ticketsCreatedByUser}}, {"_id" : {$in : ticketsAssignedToEngineer}}]

                const tickets = await Ticket.find(queryObj);
                res.status(200).send(tickets)
            }
            else if(user.userType == constants.userType.admin){

                const tickets = await Ticket.find();
                
                if(tickets.length == 0){
                    return res.status(200).send({
                        message : "Failed !! No Ticket Created Yet !!!"
                    })
                }
                res.status(200).send(tickets)
            }
        }

    }catch(err){
        console.log("Error in find all tickets :", err.message);
        res.status(500).send("Internal Server Error")
    }
}


exports.updateTicket = async (req, res) => {
    try{
        const ticket = await Ticket.findOne({_id : req.params.id});

        if(req.body.reporter && req.body.reporter != ticket.reporter){
            return res.status(400).send({
                message : "Failed !! You can not change Ticket Owner id !!!"
            })
        }

        ticket.title = req.body.title != undefined ? req.body.title : ticket.title;
        ticket.description = req.body.description != undefined ? req.body.description : ticket.description;
        ticket.ticketStatus = req.body.ticketStatus != undefined ? req.body.ticketStatus : ticket.ticketStatus;
        ticket.ticketPriority = req.body.ticketPriority != undefined ? req.body.ticketPriority : ticket.ticketPriority;
        ticket.assignee = req.body.assignee != undefined ? req.body.assignee : ticket.assignee;

        const updateTicket = await ticket.save();

        const reporter = await User.findOne({userId : updateTicket.reporter});
        const assignee = await User.findOne({userId : updateTicket.assignee});
        const emailContent = createContent.notificationContent(updateTicket);
        
        // send email 
        sendNtificationReq(`Ticket Updated Successfully !!! Ticket_Id : ${updateTicket._id}`,`${reporter.email},${assignee.email},${constants.mailCriteria.ADMIN_MAIL_ID}`,`Yeahhh !! Your Ticket is Updataed Successfully !!! ${'\n'} Ticket_id :  ${updateTicket._id} ${'\n'} Ticket_status :  ${updateTicket.ticketStatus} ${'\n'} Ticket_description : ${updateTicket.description}`,`${constants.mailCriteria.OWNER_NAME}`)

        res.status(200).send(updateTicket)

    }catch(err){
        console.log("Error in update ticket contrller : ", err.message)
        res.status(500).send({
            message : "Internal Server Error"
        })
    }
};
