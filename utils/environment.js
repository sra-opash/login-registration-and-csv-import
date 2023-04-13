require("dotenv").config();

module.exports = {
    port: process.env.API_PORT,
    database:{
        uri: process.env.MONGO_URI,
    },
    jwt: {
        secret: process.env.JWT_TOKEN,
        expiredIn: process.env.JWT_EXPIRED_IN
    }
}