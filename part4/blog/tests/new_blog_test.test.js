const { test, describe, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/users')
const helper = require('./test.helper')

const api = supertest(app)

beforeEach( async() => {
    await User.deleteMany({})
    for (const user of helper.initialUser) {
        await api
            .post('/api/users')
            .send(user)
    }
})
describe('tests for user implementation', () =>{
    test('sucess with status 200 with login and sucess with status 201 creating a new blog', async() => {
    //login to get the token
    const user = {
        username: helper.initialUser[0].username,
        password: helper.initialUser[0].password
    }
    const login = await api
                        .post('/api/login')
                        .send(user)
                        .expect(200)
    //get userid to send a blog post
    const userId = await helper.userInDb()
    const blog = {
        title: 'First blog',
        author: 'Author One',
        url: 'http://example.com/1',
        likes: 5,
        user: userId.id
    }
    await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${login.body.token}`)
        .send(blog)
        .expect(201)
})

test('fail with 401 no valid token', async () => {
    const blog = {
        title: 'First blog',
        author: 'Author One',
        url: 'http://example.com/1',
        likes: 5,
        user: '68694c49e1ee1ea2824973c0'
    }
    await api
    .post('/api/blogs')
    .send(blog)
    .expect(401)
})
})

after(async () => {
  await mongoose.connection.close()
})