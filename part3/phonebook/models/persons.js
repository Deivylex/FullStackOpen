const mongoose = require('mongoose');

const url = process.env.MONGOOSE_URL;
mongoose.set('strictQuery',false);

console.log('connecting to', url)
mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    required: [true, "name is required"],
    type: String,
    validate: {
      validator: function(v) {
        return v.length >= 3;
      },
      message: props => `path (${props.value}) is not a valid name! Name must be at least 3 characters long`
    }
  },
  number: {
    type: String,
    required: [true, "name is required"],
    validate: {
      validator: function (v) {
        const phoneRegex = /^\d{2,3}-\d+$/
        return phoneRegex.test(v)
      },
      message: props => ` (${props.value})  is not a valid phone number! Format must be XX-XXXXXXX or XXX-XXXXXXX`
    }
  }
});

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema, 'contacts');