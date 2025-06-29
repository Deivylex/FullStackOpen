const blogRouter = require('express').Router()
const Blog = require('../models/blog')


blogRouter.get('/', async (req, res) => {
    const blogs =  await Blog.find({})
    res.json(blogs)
})

blogRouter.post('/', async (req, res, next) => {

    const blog = new Blog({
    title: req.body.title,
    author: req.body.author,
    url: req.body.url,
    likes: req.body.likes
    })
    const savedBlog = await blog.save()
    res.status(201).json(savedBlog)
})

module.exports = blogRouter