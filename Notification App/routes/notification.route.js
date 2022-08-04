const notificationController = require('../controllers/notification.controller');

const validateNotification = require('../middlewares/validateNotification');

module.exports = (app) => {

    app.post('/notiserv/api/v1/notifications', [validateNotification.validateNotificationBody], notificationController.acceptNotificationRequest);

    app.get('/notiserv/api/v1/notifications/:id', notificationController.getNotificationDetailsById);
}