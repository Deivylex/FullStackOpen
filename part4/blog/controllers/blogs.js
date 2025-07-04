const blogRouter = require('express').Router()
//const { response } = require('../app')
const Blog = require('../models/blog')
const Users = require('../models/users')
const jwt = require('jsonwebtoken')

blogRouter.get('/', async (req, res) => {
    const blogs =  await Blog.find({}).populate('user', {username: 1, name: 1})
    res.json(blogs)
})

blogRouter.post('/', async (req, res) => {

    console.log('token ', req.token)
    const decodedToken = jwt.verify(req.token, process.env.JWT_SECRET)
    if (!decodedToken.id) {
        return response.status(401).json({ error: 'token invalid' })
    }
    const user = await Users.findById(decodedToken.id)
    if (!user) {
    return res.status(400).json({ error: 'userId missing or not valid' })
    }
    const blog = new Blog({
    title: req.body.title,
    author: req.body.author,
    url: req.body.url,
    likes: req.body.likes,
    user: user._id
    })
    const savedBlog = await blog.save()

    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    res.status(201).json(savedBlog)
})

blogRouter.delete('/:id', async (req, res) => {
    const blog =  await Blog.findById(req.params.id)
    if (!blog){
        return res.status(404).end()
    }
    const decodedToken = jwt.verify(req.token, process.env.JWT_SECRET)
    if (!decodedToken.id) {
        return res.status(401).json({ error: 'token missing' })
    }
    if (decodedToken.id.toString()  !== blog.user.toString()) {
        return res.status(401).json({ error: 'unauthorized user' })
    }
    await Blog.findByIdAndDelete(req.params.id)
    res.status(204).end()
})

blogRouter.put('/:id', async (req, res) => {   
    const blog = await Blog.findById(req.params.id)
    if(!blog){
        return res.status(404).end()
    }
    blog.title =  req.body.title || blog.title
    blog.author =  req.body.author || blog.author
    blog.url =  req.body.url || blog.url
    blog.likes =  req.body.likes
    const response =  await blog.save()
    res.json(response)
})

module.exports = blogRouter