require('dotenv').config()

const PORT = process.env.PORT
const MONGO_URI = process.env.NODE_ENV === 'test' ? process.env.TEST_MONGO_URI : process.env.MONGO_URI
const NODE_ENV = process.env.NODE_ENV
const SECRET = process.env.SECRET
module.exports = {
    PORT,
    MONGO_URI,
    NODE_ENV,
    SECRET
}