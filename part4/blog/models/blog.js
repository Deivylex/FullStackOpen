const mongoose = require('mongoose')

const blogSchema = mongoose.Schema({
  title: {
    type: String,
    required : true,
    validate: {
      validator: function(v) {
        return v && v.trim().length > 0
      }
    },
    message: 'title is empty'
  },
  author: String,
  url: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return v && v.trim().length > 0
      }
    },
    message: 'url empty'
  },
  likes:{
    type: Number,
    default: 0
  }
})

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Blog = mongoose.model('Blog', blogSchema)

module.exports = Blog