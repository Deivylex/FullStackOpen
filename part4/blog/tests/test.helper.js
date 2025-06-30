const app = require('../app')
const supertest = require('supertest')

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

let blogs = [
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

const blogsInDB = async () => {
    const response = await api.get('/api/blogs')
    return response.body
}

module.exports = { initialBlogs, blogsInDB, blogs }