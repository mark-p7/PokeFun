const mongoose = require('mongoose')
const https = require('https');

// Obtain Types
var types = [];

// Obtain API
var api = 'https://raw.githubusercontent.com/fanzeyi/pokemon.json/master';

// Get types
const getTypes = () => {
    return new Promise((accept, reject) => {
        https.get(api + '/types.json', res => {
            var chunks = ''
            res.on("data", (chunk) => {
                chunks += chunk
            })
            res.on("end", () => {
                let typesArr = JSON.parse(chunks);
                typesArr.forEach(type => {
                    types.push(type["english"])
                });
                accept()
            })
        })
    }
    )
}
getTypes()

const PokemonSchema = new mongoose.Schema({
    "base": {
        "HP": Number,
        "Attack": Number,
        "Defense": Number,
        "Speed": Number,
        "Speed Attack": Number,
        "Speed Defense": Number,
    },
    "id": {
        type: Number,
        required: true,
    },
    "name": {
        "english": {
            type: String,
            required: true,
            maxlength: 20
        },
        "japanese": String,
        "chinese": String,
        "french": String
    },
    "type": {
        type: [String],
        enum: types,
        required: true
    },
    "__v": Number
});

module.exports = mongoose.model('Pokemon', PokemonSchema);