const mongoose = require('mongoose')
// declare schema from mongoose
const Schema = mongoose.Schema

// define new schema
const userSchema = new Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  cartData: {
    type: Object
  },
  date: {
    type: Date,
    default: Date.now,
  }
})

// create and export a user model to be used elsewhere using the schema above
module.exports = mongoose.model('User', userSchema)