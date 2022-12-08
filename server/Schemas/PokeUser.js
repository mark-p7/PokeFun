const mongoose = require('mongoose')

const PokeUser = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    min: 3,
    max: 20
  },
  password: {
    type: String,
    required: true,
    trim: true,
    min: 6,
    max: 1000,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    min: 3
  },
  date: {
    type: Date,
    default: Date.now
  },
  token: {
    default: [],
    type: [String]
  },
  role: {
    default: 'user',
    type: String
  }
})

module.exports = mongoose.model('pokeUser', PokeUser) //pokeUser is the name of the collection in the db
