// Package Imports
const express = require('express');
const mongoose = require('mongoose');
const { Schema } = mongoose;
const https = require('https');
const dotenv = require("dotenv");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');

// Errors
const {
    PokemonBadRequestError,
    PokemonDbError,
    PokemonMissingIdError,
    PokemonNotFoundError,
    InvalidRouteError } = require('./Errors/ErrorHandling.js')

// Models
const PokemonUserModel = require('./Schemas/PokeUser.js')
const PokemonModel = require('./Schemas/Pokemon.js')
const PokeRequestModel = require('./Schemas/RequestLog.js')

// Configure enviornment variables
dotenv.config();

// Create Express APp
const app = express();
const port = 8888;

// Api link
var api = 'https://raw.githubusercontent.com/fanzeyi/pokemon.json/master';

// Use json parsing in express app
app.use(express.json());

// Use cors
app.use(cors())

// Connect to database
const connStringLocal = "mongodb://localhost:27017/Pokemon"
mongoose.connect(process.env.DB_STRING || connStringLocal);

var pokemon = [];

// Async Wrapper Function to handle errors
const asyncWrapper = (fn) => {
    return async (req, res, next) => {
        try {
            await fn(req, res, next);
        } catch (error) {
            return next(error)
            // res.status(400).json({ errName: error.name, errMsg: error.message })
        }
    }
}

// Verify Access Token
function verifyAccessToken(token) {
    try {
        return jwt.verify(token, process.env.TOKEN_SECRET);
    } catch (err) {
        return null
    }
}

app.listen(process.env.PORT || port, async () => {

    // // Drop database
    // await PokemonModel.db.dropDatabase();

    // // Create Unique Index
    // await PokemonModel.db.collection('pokemons').createIndex({ "id": 1 }, { unique: true })
    // await PokemonUserModel.db.collection('pokeusers').createIndex({ "username": 1 }, { unique: true })

    // // Seed Database with Pokemon Data --> async
    // https.get(api + '/pokedex.json', res => {
    //     var chunks = ''
    //     res.on("data", (chunk) => {
    //         chunks += chunk
    //     })
    //     res.on("end", () => {
    //         pokemon = JSON.parse(chunks);
    //         pokemon = pokemon.sort()
    //         pokemon.forEach(pokemon => {
    //             PokemonModel.create(pokemon)
    //         });
    //     })
    // });

    console.log("App is now running");
})

const auth = asyncWrapper(async (req, res, next) => {
    // This gets the token either from body, query or headers
    const token = req.body.token || req.query.token || req.headers["x-access-token"] || req.headers["auth-token"];
    
    // This create the pokerequest object
    const request = await PokeRequestModel.create({ userEmail: email, url: req.originalUrl, query: req.query, method: req.method, body: req.body, status: 200 })
    req.body.pokeRequestId = request._id;
    
    // If there is no token, throw an error
    if (!token) throw new PokemonBadRequestError("A token is required to access this route")
    
    // Verify Token
    const decoded = verifyAccessToken(token)

    // Throw an error if return null value (null value means an error was thrown whilst verifying the token)
    if (!decoded) throw new PokemonBadRequestError("Invalid Token")

    // Check if Token still exists in database
    const user = await PokemonUserModel.findOne({ token: token }).catch((err) => {
        throw new PokemonBadRequestError("Invalid Token")
    })
    if (!user) throw new PokemonBadRequestError("Invalid Token")
    console.log(user)
    var email = await user.email
    console.log("email: " + email)
    request.userEmail = email;
    request.role = user.role;
    await request.save();
    console.log("Request Logged");
    console.log(request);

    // If no error was thrown that means that the verification of the token was successful and it will redirect to the route requested
    next();
})

const adminAuth = asyncWrapper(async (req, res, next) => {
    // This gets the token either from body, query or headers
    const token = req.body.token || req.query.token || req.headers["x-access-token"] || req.headers["auth-token"];

    // This create the pokerequest object
    const request = await PokeRequestModel.create({ url: req.originalUrl, query: req.query, method: req.method, body: req.body, status: 200 })
    req.body.pokeRequestId = request._id;

    // If there is no token, throw an error
    if (!token) throw new PokemonBadRequestError("A token is required to access this route")

    // Verify Token
    const decoded = verifyAccessToken(token)

    // Throw an error if return null value (null value means an error was thrown whilst verifying the token)
    if (!decoded) throw new PokemonBadRequestError("Invalid Token")

    // Check if Token still exists in database
    const user = await PokemonUserModel.findOne({ token: token }).catch((err) => {
        throw new PokemonBadRequestError("Invalid Token")
    })
    if (!user) throw new PokemonBadRequestError("Invalid Token")
    if (user.role != "admin") throw new PokemonBadRequestError("You are not an admin")
    console.log(user)
    var email = await user.email
    console.log("email: " + email)
    request.userEmail = email;
    request.role = user.role;
    await request.save();
    console.log("Request Logged");
    console.log(request);

    // If no error was thrown that means that the verification of the token was successful and it will redirect to the route requested
    next();
})

app.use(asyncWrapper(async (req, res, next) => {
    // console.log("Request URL     :    " + JSON.stringify(req.originalUrl))
    // console.log("Request QUERY   :    " + JSON.stringify(req.query))
    // console.log("Request METHOD  :    " + JSON.stringify(req.method))
    // console.log("Request BODY    :    " + JSON.stringify(req.body))
    // console.log(req)
    next();
}));

// Error Handling Routes
app.get('/api/v1/pokemonBadRequestError', asyncWrapper(async (req, res) => {
    throw new PokemonBadRequestError("Bad Request Error")
}))

app.get('/api/v1/pokemonNotFoundError', asyncWrapper(async (req, res) => {
    throw new PokemonNotFoundError("Pokemon not found Error")
}))

app.get('/api/v1/pokemonMissingIdError', asyncWrapper(async (req, res) => {
    throw new PokemonMissingIdError("Missing ID Error")
}))

app.get('/api/v1/PokemonDbError', asyncWrapper(async (req, res) => {
    throw new PokemonDbError("Pokemon Db Error")
}))

app.get('/api/v1/InvalidRouteError', asyncWrapper(async (req, res) => {
    throw new InvalidRouteError("Invalid Route Error")
}))

// Get all Pokemon (New Error handling)
app.get('/api/v1/pokemons', auth, asyncWrapper(async (req, res) => {

    // Get Query Params
    let count = req.query.count;
    let after = req.query.after;

    // If Count and After do not appear in the Query
    if (count == null && after == null) {
        await PokemonModel.find({}).sort({ id: 1 }).then(pokemon => {
            res.json(pokemon)
        }).catch(err => {
            throw new PokemonDbError("Error in finding Pokemon")
        })
        return;
    }

    // If Count is NaN
    if (!isNaN(after) && isNaN(count)) {
        await PokemonModel.find({}).sort({ id: 1 }).skip(after).then(pokemon => {
            res.json(pokemon)
        }).catch(err => {
            throw new PokemonDbError("Error in finding Pokemon")
        })
        return
    }

    // If After is NaN
    if (isNaN(after) && !isNaN(count)) {
        await PokemonModel.find({}).sort({ id: 1 }).limit(count).then(pokemon => {
            res.json(pokemon)
        }).catch(err => {
            throw new PokemonDbError("Error in finding Pokemon")
        })
        return
    }

    // If Count and After is a Number
    if (!isNaN(after) && !isNaN(count)) {
        await PokemonModel.find({}).sort({ id: 1 }).skip(after).limit(count).then(pokemon => {
            res.json(pokemon)
        }).catch(err => {
            throw new PokemonDbError("Error in finding Pokemon")
        })
        return
    }

    // If Count and After is NaN
    throw new PokemonBadRequestError("Invalid Query Params")
}));

// Get a Pokemon by ID (New Error Handling)
app.get('/api/v1/pokemon/:id', auth, asyncWrapper(async (req, res) => {

    if (isNaN(req.params.id)) {
        throw new PokemonNotFoundError("Pokemon not found Error");
    }

    var pokemon = await PokemonModel.find({ "id": req.params.id })
    if (pokemon.length === 0) {
        throw new PokemonNotFoundError("Pokemon not found Error")
    } else {
        res.json(pokemon)
    }

}));

// Get a Pokemon Image (New Error Handling)
app.get('/api/v1/pokemonImage/:id', adminAuth, asyncWrapper(async (req, res) => {
    let urlId = req.params.id;
    console.log(parseInt(req.params.id));
    if (urlId.length > 3 || parseInt(req.params.id) > 809) {
        throw new PokemonNotFoundError("Pokemon not found Error")
    }
    if (urlId.length != 3) {
        while (urlId.length < 3) {
            urlId = "0" + urlId;
        }
    }
    let url = api + "/images/" + urlId + ".png"
    res.json({ "url": url })
}));

// Create a Pokemon (New Error Handling)
app.post('/api/v1/pokemon', adminAuth, asyncWrapper(async (req, res) => {
    await PokemonModel.create(req.body).catch((err) => {
        throw new PokemonBadRequestError('Bad Request Error')
    })
    res.json({ "msg": "Added Successfully" })
}))

// Delete a pokemon (New Error Handling)
app.delete('/api/v1/pokemon/:id', adminAuth, asyncWrapper(async (req, res) => {

    if (isNaN(req.params.id)) {
        throw new PokemonMissingIdError("Missing ID Error")
    }

    var deletedPokemon = await PokemonModel.findOneAndDelete({ "id": req.params.id }).catch(() => {
        throw new PokemonNotFoundError("Pokemon not found Error")
    })

    if (deletedPokemon == undefined) throw new PokemonNotFoundError("Pokemon not found Error")

    res.json({ "msg": "Deleted Successfully", "pokeInfo": deletedPokemon })
}))

// Upsert (New Error Handling)
app.put('/api/v1/pokemon/:id', adminAuth, asyncWrapper(async (req, res) => {
    var pokemon = await PokemonModel.findOneAndReplace({ "id": req.params.id }, req.body, { upsert: true, new: true }).catch((err) => {
        if (err.codeName == "DuplicateKey") throw new PokemonDbError('Database Error: Duplicate ID')
        else throw new PokemonDbError('Database Error: Please check your request body')
    })
    res.json({ "msg": "Updated Successfully", "pokeInfo": pokemon })
}))

// Update a pokemon (New Error Handling)
app.patch('/api/v1/pokemon/:id', adminAuth, asyncWrapper(async (req, res) => {
    if (req.params.id == null || isNaN(req.params.id)) {
        throw new PokemonMissingIdError("Missing ID Error")
    }
    var pokemonDoc = {}
    pokemonDoc = await PokemonModel.findOneAndUpdate({ "id": req.params.id }, req.body, {
        new: true,
        upsert: true,
        returnDocument: 'before'
    }).catch((err) => {
        if (err.codeName == "DuplicateKey") throw new PokemonDbError('Database Error: Duplicate ID')
        else throw new PokemonDbError('Database Error: Please check your request body')
    })
    res.json({
        "msg": "Updated Successfully",
        "pokeInfo": pokemonDoc
    })
}));

// Get Poke Requests
app.get('/api/v1/pokeRequests', adminAuth, asyncWrapper(async (req, res) => {
    await PokeRequestModel.find({}).then(pokeRequests => {
        res.json(pokeRequests)
    }).catch(err => {
        throw new PokemonDbError("Error in finding Poke Requests")
    })
}))

// Catch all other routes
app.get('*', asyncWrapper(async (req, res) => {
    throw new InvalidRouteError("Invalid route: please check documentation")
}))

// Next Middleware to handle errors
app.use((err, req, res, next) => {
    if (!err.code) {
        err.code = 500;
    }
    console.log(req.body)
    PokeRequestModel.findOne({ _id: req.body.pokeRequestId }).then((pokeRequest) => {
        if (!pokeRequest) {
            return;
        }
        pokeRequest.status = err.code;
        pokeRequest.save();
    })
    res.status(err.code).json({ errName: err.name, errMsg: err.message, errCode: err.code, errStack: err.stack })
    // The Commented out code below is a user friendly version of the api that doesn't send the Error Stack in the response, but instead prints it in console
    // console.log(err.stack)
    // res.status(err.code).json({ errName: err.name, errMsg: err.message, errCode: err.code })
})