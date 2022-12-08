const mongoose = require('mongoose')

const PokeRequest = new mongoose.Schema({
    userEmail: {
        default: "",
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    },
    dateInSeconds: {
        type: Number,
        default: Math.round(Date.now()/1000)
    },
    url: {
        default: "",
        type: String,
    },
    query: {
        default: {},
        type: Object,
    },
    method: {
        default: {},
        type: Object,
    },
    body: {
        default: {},
        type: Object,
    },
    status: {
        default: 0,
        type: Number,
    },
    role: {
        default: "",
        type: String,
    }
})

module.exports = mongoose.model('pokeRequest', PokeRequest) //pokeUser is the name of the collection in the db
