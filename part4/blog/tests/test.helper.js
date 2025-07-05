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

const initialUser = [
  {
    username: 'jose',
    name: 'pp',
    password: '12345'
  },
  {
    username: 'carlos',
    name: 'pp',
    password: '12345'
  }
]

const userInDb = async() => {
  const users = await api.get('/api/users')
  return users.body
}

const validToken = async() => {
  const user = {
      username: initialUser[0].username,
      password: initialUser[0].password
  }
  const login = await api
                .post('/api/login')
                .send(user)
  return login.body
}

const blogsInDB = async () => {
    const response = await api.get('/api/blogs')
    return response.body
}

module.exports = { initialBlogs, blogsInDB, blogs, initialUser, userInDb, validToken }