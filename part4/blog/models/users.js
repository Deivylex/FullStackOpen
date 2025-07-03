const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function(v) {
                return v && v.trim().length > 2
        },
        message: function(props) {
            return `:'${props.value}' is invalid, must be at least 3 characters long`
        }
    }
    },
    name: {
        type: String
    },
    passwordHash: {
        type: String,
    },
    blogs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Blog'
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