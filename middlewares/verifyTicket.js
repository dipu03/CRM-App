const Ticket = require('../models/ticket.model');
const User = require('../models/user.model');
const constants = require('../utils/constants');


const validateTicketRequestBody = async (req, res, next) => {
    try{
        if(!req.body.title || !req.body.description){
            return res.status(400).send({
                message : "Failed !! required Field missed ! must put [title, description] to create a a Ticket !!!"
            })
        }
        
        const engineerAvailable = await User.findOne({
            userType : constants.userType.engineer, 
            userStatus : constants.userStatus.approved
        });


        if(!engineerAvailable){
            return res.status(500).send({
                message : "Failed !! No Engineer Available At this Moment please try after some time !!!"
            })
        }
        next()

    }catch(err){
        console.log("Error in ticket body validation");
        res.status(200).send({
            message : "Internal Server Error !!!"
        })
    }
}

const isValidOwnerOfTheTicket = async (req, res, next) => {
    
    try{

        const user = await User.findOne({userId : req.userId});
        const ticket = await Ticket.findOne({_id : req.params.id});

        if(!ticket){
            return res.status(400).send({
                message : "Failed !! Ticket id is not valid !!!"
            })
        }


        if(user.userType == constants.userType.customer){
            const ownerId = ticket.reporter;

            if(user.userId != ownerId){
                return res.status(403).send({
                    message : "Failed !! Only ADMIN || OWNER || Assigned ENGINEER can do this action !!!"
                })
            }

        }else if(user.userType == constants.userType.engineer){

            const ownerId = ticket.reporter;
            const assigneeId = ticket.assignee;

            if(user.userId != ownerId && user.userId != assigneeId){
                return res.status(403).send({
                    message : "Failed !! Only ADMIN || OWNER || Assigned ENGINEER can do this action !!!"
                })
            }
        }

        if(req.body.assignee != undefined && req.body.assignee != ticket.assignee){

            if(user.userType != constants.userType.admin){
                return res.status(403).send({
                    message : "Failed !! Only Admin can re assign the ticket !!!"
                })
            }

            const engineer = await User.findOne({userId : req.body.assignee});

            if(!engineer || engineer.userStatus != constants.userStatus.approved){
                return res.status(401).send({
                    message : "Failed !! Assignee id is not valid !!!"
                })
            }

        }

        next()

    }catch(err) {
        console.log("Error in isValidateOwner of the Ticket : "+err)
        res.status(500).send({
            message : "Internal Server Error !!!"
        })
    }
}

const ticketValidation = {
    validateTicketRequestBody : validateTicketRequestBody,
    isValidOwnerOfTheTicket : isValidOwnerOfTheTicket
}
module.exports = ticketValidation;