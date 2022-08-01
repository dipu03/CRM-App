const nodemailer = require('nodemailer');

module.exports = nodemailer.createTransport({
    service : 'gmail',
    auth : {
        user : "bhoumik.dipu03121997@gmail.com",
        pass : "kmlvvlepmvmmznxv"
    }
});