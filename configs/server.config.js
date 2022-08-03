
if(process.env.NODE_ENV != "production"){
    require("dotenv").config()
}

module.exports = {
    PORT : process.env.PORT,
    DB_URL : process.env.DB_URL,
    SECRET_KEY : process.env.SECRET_KEY,
    NOTIFICATION_REQ_URL : process.env.NOTIFICATION_REQ_URL,
    CONTENT_TYPE : process.env.CONTENT_TYPE
}