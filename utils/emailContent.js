
exports.notificationContent = (createdTicket) => {
    const emailContent = {}

    // emailContent.message = " Your Ticket is Created Successfully !!! congratulation !!!"
    emailContent.Ticket_id = createdTicket._id ,
    emailContent.Title =  createdTicket.title,
    emailContent.Description = createdTicket.description,
    emailContent.Reporter = createdTicket.reporter,
    emailContent.Ticket_Status = createdTicket.ticketStatus,
    emailContent.Created_At = createdTicket.createdAt,
    emailContent.Updated_At = createdTicket.updatedAt

    return JSON.stringify(emailContent)
}
