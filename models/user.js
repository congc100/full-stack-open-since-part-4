const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: String,
  // encrypted password
  password: String,
  name: String,
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    // the password should not be revealed
    delete returnedObject.password
  }
})

const User = mongoose.model('User', userSchema)

module.exports = User