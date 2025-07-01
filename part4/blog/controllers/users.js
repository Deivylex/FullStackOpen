const usersRoute = require('express').Router()
const Users = require('../models/users')
const bcrypt = require('bcrypt')

usersRoute.get('/', async(req, res) => {
    const response = Users.find({})
    res.json(response)
})

usersRoute.post('/', async(req, res) => {
    const body = req.body

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const newUser = new Users({
        userName: body.userName,
        name: body.name,
        password: passwordHash
    })
    const response = await newUser.save()

    res.status(201).json(response)
})

module.exports = usersRoute