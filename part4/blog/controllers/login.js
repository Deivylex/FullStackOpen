const jwt = require('jsonwebtoken')
const loginRoute = require('express').Router()
const bcrypt = require('bcrypt')
const logger = require('../utils/logger')
const Users = require('../models/users')

loginRoute.post('/', async (req, res) => {
    const { username, password } = req.body

    const user = await Users.findOne({ username })
    if (!user)
    {
        return res.status(401).json({error: 'invalid, username or password'})
    }
    logger.info('login ', user  )
    const validPassword = await bcrypt.compare(password, user.passwordHash)
    if (!validPassword)
    {
        return res.status(401).json({error: 'invalid, username or password'})
    }
    const userToken = {
        username: username,
        id: user._id,
    }
    const token = jwt.sign(userToken, process.env.JWT_SECRET)
    res.status(200).send({token, username: user.username, name: user.name})
})

module.exports = loginRoute