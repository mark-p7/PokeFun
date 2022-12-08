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

// Configure enviornment variables
dotenv.config();

// Create Express APp
const app = express();
const port = 8889;

// Use json parsing in express app
app.use(express.json());

// Use cors
app.use(cors({
    exposedHeaders: ['auth-token-access', 'auth-token-refresh']
}));

// Connect to database
const connStringLocal = "mongodb://localhost:27017/Pokemon"
mongoose.connect(process.env.DB_STRING || connStringLocal);

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

// Generate Access Token
function generateAccessToken(userId) {
    return jwt.sign(userId, process.env.TOKEN_SECRET);
}

app.listen(process.env.AUTH_PORT || port, async () => {
    console.log("Authentication server running on port " + process.env.AUTH_PORT || port);
})

app.use(asyncWrapper(async (req, res, next) => {
    // console.log("Request URL     :    " + JSON.stringify(req.originalUrl))
    // console.log("Request QUERY   :    " + JSON.stringify(req.query))
    // console.log("Request METHOD  :    " + JSON.stringify(req.method))
    // console.log("Request BODY    :    " + JSON.stringify(req.body))
    // console.log(req)
    next();
}));

// Registration for Admin users
app.post('/register/admin', asyncWrapper(async (req, res) => {

    if (req.headers["admin-key"] != process.env.ADMIN_KEY) throw new PokemonBadRequestError("Invalid Admin Key");

    // Obtaining body parameters
    const { username, password, email } = req.body;

    // Generate salt
    const salt = await bcrypt.genSalt(10);

    // Setting user password
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create User with Hashed password object
    const userHashedPass = { ...req.body, password: hashedPassword, role: "admin" }

    // Create the User
    const user = await PokemonUserModel.create({ ...userHashedPass }).catch((err) => {
        throw new PokemonBadRequestError("User already exists")
    })

    // Send response back to client
    res.status(201).json(user)
}))

// Registration
app.post('/register', asyncWrapper(async (req, res) => {

    // Obtaining body parameters
    const { username, password, email } = req.body;

    // Generate salt
    const salt = await bcrypt.genSalt(10);

    // Setting user password
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create User with Hashed password object
    const userHashedPass = { username: username, email: email, password: hashedPassword }

    // Creates the User
    try {
        const user = await PokemonUserModel.create({ ...userHashedPass })
        // Send response back to client
        res.status(201).json(user)
    } catch (err) {
        throw new PokemonBadRequestError("User already exists")
    }

}))

// Login
app.post('/login', asyncWrapper(async (req, res) => {
    // Get Request body
    const { username, password } = req.body;

    // Validate User input
    if (!(username && password)) throw PokemonBadRequestError("All inputs are required")

    // Find User
    const user = await PokemonUserModel.findOne({ username })
    if (user && (await bcrypt.compare(password, user.password))) {

        // Check for Token
        if (user.token.length != 0) {
            // Set header and send response
            res.header('auth-token', user.token[0])
            res.json(user)
            return;
        }

        // Generate Token and Send response back to client
        const token = generateAccessToken({ _id: user._id })
        user.token.push(token);
        await user.save();

        // Set header and send response
        res.header('auth-token', token)
        res.json(user)

        // Throw Errors if User does not exist or password is incorrect
    } else if (!user) throw new PokemonBadRequestError("User does not exist")
    else throw new PokemonBadRequestError("Incorrect Password")
}))

// Logout
app.post('/logout', asyncWrapper(async (req, res) => {

    // Get Request body
    const { username, password } = req.body;

    // Validate User input
    if (!(username && password)) throw new PokemonBadRequestError("All inputs are required")

    // Find User
    const user = await PokemonUserModel.findOne({ username })
    if (user && (await bcrypt.compare(password, user.password))) {

        if (user.token.length == 0) {
            res.json({ username: user.username, message: "User is already logged out" })
            return;
        }
        user.token = [];
        await user.save();

        // Send response back to client
        res.json({ username: user.username, message: "Logged out successfully" })

        // Throw Errors if User does not exist or password is incorrect
    } else if (!user) throw new PokemonBadRequestError("User does not exist")
    else throw new PokemonBadRequestError("Incorrect Password")
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
    res.status(err.code).json({ errName: err.name, errMsg: err.message, errCode: err.code, errStack: err.stack })
    // The Commented out code below is a user friendly version of the api that doesn't send the Error Stack in the response, but instead prints it in console
    // console.log(err.stack)
    // res.status(err.code).json({ errName: err.name, errMsg: err.message, errCode: err.code })
})