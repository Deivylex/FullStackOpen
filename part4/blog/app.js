const logger = require('./utils/logger')
const config = require('./utils/config')
const blogRouter = require('./controllers/blogs')
const middleware = require('./utils/middleware')
const express = require('express')
const mongoose = require('mongoose')

const app = express()

logger.info(`Connecting to MongoDB url ${config.mongoUrl}...`)

mongoose.set('strictQuery',false)
mongoose.connect(config.mongoUrl)
    .then(() => logger.info('MongoDB connected'))
    .catch(err => logger.error('MongoDB connection error:', err))

app.use(express.json())
app.use(middleware.requestLogger)
app.use('/api/blogs', blogRouter)
app.use(middleware.unknownEndpoint)

module.exports = app