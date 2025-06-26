const _ = require('lodash')

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog =  (blogs) => {
    if (blogs.length === 0) {
        return null
    }
    return blogs.reduce((top, blog) => {
        if(top.likes < blog.likes)
            top = blog;
        return top
    })
}

const mostBlogs = (blogs) => {
    
    if (blogs.length === 0) {
        return null
    }
    const joinAuthors =  _.groupBy(blogs, 'author')

    const authorBlogs = Object.entries(joinAuthors).map(([author, blogs]) => {
        return { 
            author, 
            blogs: blogs.length 
        }
    })
    return _.maxBy(authorBlogs, 'blogs')
}

const mostLikes = (blogs) => {
    if (blogs.length === 0) {
        return null
    }
    const joinAuthors =  _.groupBy(blogs, 'author')
    const authorLikes = Object.entries(joinAuthors).map(([author, blogs]) => {
    return { 
        author, 
        likes: blogs.reduce((sum, blog) => sum + blog.likes, 0) 
    }
    })
    return _.maxBy(authorLikes, 'likes')
}

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes }