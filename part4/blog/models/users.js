const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    username: {
        type: String,
    },
    name: {
        type: string
    },
    passwordHash: {
        type: string
    },
    blogs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Blogs'
        }
    ]
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passwordHash
  }
})

const Users = mongoose.model('Users', userSchema)

module.exports = Users