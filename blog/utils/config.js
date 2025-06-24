require('dotenv').config()

const port = process.env.PORT || 3003

const mongoUrl = process.env.MONGODB_URI

module.exports = {port, mongoUrl}