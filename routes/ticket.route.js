
const ticketController = require('../controllers/ticket.controller');
const {authJwt} = require('../middlewares');
const {validateTicket} = require('../middlewares')

module.exports = (app) => {

    app.post('/crm/api/v1/create/tickets', [authJwt.verifyToken, validateTicket.validateTicketRequestBody], ticketController.createTicket);


    app.get('/crm/api/v1/tickets', [authJwt.verifyToken], ticketController.findAllTickets);


    app.put('/crm/api/v1/tickets/:id', [authJwt.verifyToken, validateTicket.isValidOwnerOfTheTicket], ticketController.updateTicket);
}