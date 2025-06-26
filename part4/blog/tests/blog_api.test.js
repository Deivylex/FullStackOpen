const { test, describe, beforeEach, after } = require('node:test')
const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

const initialBlogs = [
  {
    title: 'First blog',
    author: 'Author One',
    url: 'http://example.com/1',
    likes: 5
  },
  {
    title: 'Second blog',
    author: 'Author Two',
    url: 'http://example.com/2',
    likes: 10
  }
]

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(initialBlogs)
})

test('GET /api/blogs returns all blogs', async () => {
  const response = await api.get('/api/blogs')

  // Verifica cantidad
  if (response.body.length !== initialBlogs.length) {
    throw new Error(`Expected ${initialBlogs.length} blogs, but got ${response.body.length}`)
  }
})

after(async () => {
  await mongoose.connection.close()
})
