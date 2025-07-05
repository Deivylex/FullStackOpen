const blogRouter = require('express').Router()
//const { response } = require('../app')
const Blog = require('../models/blog')
const Users = require('../models/users')
const middleware = require('../utils/middleware')
const jwt = require('jsonwebtoken')

blogRouter.get('/', async (req, res) => {
    const blogs =  await Blog.find({}).populate('user', {username: 1, name: 1})
    res.json(blogs)
})

blogRouter.post('/', middleware.userExtractor, async (req, res) => {
    const blog = new Blog({
    title: req.body.title,
    author: req.body.author,
    url: req.body.url,
    likes: req.body.likes,
    user: req.user._id
    })
    const savedBlog = await blog.save()
    req.user.blogs = req.user.blogs.concat(savedBlog._id)
    await req.user.save()
    res.status(201).json(savedBlog)
})

blogRouter.delete('/:id',middleware.userExtractor, async (req, res) => {
    const blog =  await Blog.findById(req.params.id)
    if (!blog){
        return res.status(404).end()
    }
    if (req.user._id.toString()  !== blog.user.toString()) {
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