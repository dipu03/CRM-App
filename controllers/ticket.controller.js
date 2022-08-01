const User = require('../models/user.model');
const Ticket = require('../models/ticket.model');
const constants = require('../utils/constants');

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
            engineer = getEngineer(engineers)
            ticketObj.assignee = engineer.userId
        }

        const ticket = await Ticket.create(ticketObj)

        if(ticket){

            // update ticket in reporter's document
            const user = await User.findOne({userId : req.userId});
            user.ticketsCreated.push(ticket._id)
            await user.save()


            // update ticket in assignee's document
            if(engineer){
                engineer.ticketsAssigned.push(ticket._id);
                await engineer.save()
            }
            res.status(201).send(ticket)
        }

    }catch(err){
        console.log("Error in ticket creation controller : " + err);
        res.status(500).send({
            message : "Internal Server Error"
        })
    }
};

// to filter the less load engineer
function getEngineer(engineers){
    let tempEng;
    let len = Number.MAX_SAFE_INTEGER;
    for(let engineer of engineers){
        if(engineer.ticketsAssigned.length < len){
            tempEng = engineer;
            len = engineer.ticketsAssigned.length
        }
    }
    return tempEng
}


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

                // let allTicketsOfEngineer = ticketsCreatedByEngineer.concat(ticketsAssignedToEngineer);

                // queryObj._id = {$in : allTicketsOfEngineer}
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
        console.log("Error in find all tickets");
        res.status(500).send("Internal Server Error")
    }
}


exports.updateTicket = async (req, res) => {
    try{
        const ticket = await Ticket.findOne({_id : req.params.id});

        ticket.title = req.body.title != undefined ? req.body.title : ticket.title;
        ticket.description = req.body.description != undefined ? req.body.description : ticket.description;
        ticket.ticketStatus = req.body.ticketStatus != undefined ? req.body.ticketStatus : ticket.ticketStatus;
        ticket.ticketPriority = req.body.ticketPriority != undefined ? req.body.ticketPriority : ticket.ticketPriority;
        ticket.assignee = req.body.assignee != undefined ? req.body.assignee : ticket.assignee;

        const updateTicket = await ticket.save();
        res.status(200).send(updateTicket)

    }catch(err){
        console.log("Error in update ticket contrller : "+err)
        res.status(500).send({
            message : "Internal Server Error"
        })
    }
};
