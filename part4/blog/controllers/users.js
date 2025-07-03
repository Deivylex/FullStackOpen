const usersRoute = require('express').Router()
const Users = require('../models/users')
const bcrypt = require('bcrypt')
const logger = require('../utils/logger')


usersRoute.get('/', async(req, res) => {
    const response = await Users.find({}).populate('blogs', {title: 1, author: 1, url: 1, likes: 1})
    res.json(response)
})

usersRoute.post('/', async(req, res) => {
    const body = req.body
    if(!body.password || body.password.length < 3)
    {
        return res.status(400).json({error: 'password must be at least 3 characters long'})
    }
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const newUser = new Users({
        username: body.username,
        name: body.name,
        passwordHash: passwordHash
    })
    const response = await newUser.save()

    res.status(201).json(response)
})

module.exports = usersRoute