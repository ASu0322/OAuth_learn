const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 255
  },
  googleID: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  },
  thumbnail: {
    type: String
  },
  // 本地註冊需要
  email: {
    type: String
  },
  password: {
    type: String,
    minLength: 8,
    maxLength: 1024
  }
})

module.exports = mongoose.model('User', userSchema)
