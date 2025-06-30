const blogRouter = require('express').Router()
//const { response } = require('../app')
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

blogRouter.delete('/:id', async (req, res) => {
    const response =  await Blog.findByIdAndDelete(req.params.id)
    if (!response){
        return res.status(404).end()
    }
    res.status(204).end()
})

blogRouter.put('/:id', async (req, res) => {   
    const blog = await Blog.findById(req.params.id)
    if(!blog){
        return res.status(404).end()
    }
    blog.title =  req.body.title
    blog.author =  req.body.author
    blog.url =  req.body.url
    blog.likes =  req.body.likes
    const response =  await blog.save()
    res.json(response)
})

module.exports = blogRouter