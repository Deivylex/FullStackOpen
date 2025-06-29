const { test, describe, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const Blog = require('../models/blog')
const helper = require('./test.helper')
const { title } = require('node:process')

const api = supertest(app)

beforeEach( async() => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

test('GET /api/blogs returns all blogs as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('GET /api/blogs all blogs are returned', async () => {
  const response =  await helper.blogsInDB()
  assert.strictEqual(response.length, helper.initialBlogs.length)
})

test('check if blogs has id field', async () => {
  const response = await helper.blogsInDB()
  response.forEach(blog => {
    assert.ok(blog.id, 'Expected blog to have property "id" defined')
  })
})

test('POST /api/blogs adding a new blog', async () => {
  const newBlog = {
    title: 'Third blog',
    author: 'Author Two',
    url: 'http://example.com/2',
    likes: 10
  }
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)
  const response = await helper.blogsInDB()
  assert.strictEqual(response.length, helper.initialBlogs.length + 1)
})

test('test likes property is missing', async () => {
  
  const newBlog = {
    title: 'Third blog',
    author: 'Author Two',
    url: 'http://example.com/2',
  }
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)
  const response = await helper.blogsInDB()
  assert.strictEqual(response[helper.initialBlogs.length].likes, 0) 
})

test('creating blog without title returns 400', async() => {
  const newBlog = {
  author: 'Author Two',
  url: 'http://example.com/2',
  }

  await api
  .post('/api/blogs')
  .send(newBlog)
  .expect(400)
})

test('creating blog without url returns 400', async() => {
  const newBlog = {
    title: 'deivy',
    author: 'Author Two',
  }

  await api
  .post('/api/blogs')
  .send(newBlog)
  .expect(400)
})

after(async () => {
  await mongoose.connection.close()
})
