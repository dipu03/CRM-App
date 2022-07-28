
const userController = require('../controllers/user.controller');
const {authJwt} = require('../middlewares/index');


module.exports = (app) => {

    app.get('/crm/api/v1/users' , [authJwt.verifyToken ,authJwt.isAdmin], userController.findAllUser);

    app.get('/crm/api/v1/users/:id', [authJwt.verifyToken, authJwt.isValidUserIdInParams, authJwt.isAdminOrOwner], userController.findByUserId);

    app.put('/crm/api/v1/users/:id', [authJwt.verifyToken, authJwt.isValidUserIdInParams, authJwt.validateUserTypeAndUserStatusUpdateRequest ,authJwt.isAdminOrOwner], userController.update);
}