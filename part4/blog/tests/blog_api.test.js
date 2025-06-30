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


describe('testing delete API', () => {
beforeEach( async() => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})
test('deleting a blog with unique ID', async() => {
  let db = await helper.blogsInDB()
  await api
    .delete(`/api/blogs/${db[0].id}`)
    .expect(204)
  db = await helper.blogsInDB()
  assert.strictEqual(db.length, helper.initialBlogs.length - 1)
})
test('fails with statuscode 404 if ID does not exist', async() => {
  await api
  .delete(`/api/blogs/685a9197cea0a679ee140f18`)
  .expect(404)
})
test('fails with statuscode 400 if with invalid ID', async() => {
  await api
  .delete(`/api/blogs/no-valid-id`)
  .expect(400)
})
})

describe.only('testing Update API', () => {
beforeEach( async() => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})
test('updating a blog with unique ID', async() => {
  let db = await helper.blogsInDB()
  let newBlog = [...helper.initialBlogs]
  newBlog[0].likes = 1
  await api
    .put(`/api/blogs/${db[0].id}`)
    .send(newBlog[0])
    .expect(200)
    .expect('Content-Type', /application\/json/)
  db = await helper.blogsInDB()
  assert.strictEqual(db[0].likes, newBlog[0].likes)
})
test('fails with statuscode 404 if ID does not exist', async() => {
  await api
  .put(`/api/blogs/685a9197cea0a679ee140f18`)
  .send(helper.initialBlogs[0])
  .expect(404)
})
test('fails with statuscode 400 if with invalid ID', async() => {
  await api
  .put(`/api/blogs/no-valid-id`)
  .send(helper.initialBlogs[0])  
  .expect(400)
})
})

after(async () => {
  await mongoose.connection.close()
})
