const { error } = require('./logger')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const {SECRET} = require('./config')

const unknownEndpoint = (_request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (e, _request, response, next) => {
    error(e.message)
    if (e.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (e.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    } else if (e.name === "MongoServerError" && e.message.includes("E11000 duplicate key error")) {
        return response.status(400).json({ error: "username must be unique" })
    } else if (e.name === 'JsonWebTokenError') {
        return response.status(401).json({ error: 'token invalid' })
    }
    next(error)
}

const userExtractor = async (request, response, next) => {
    const authorization = request.get('authorization')
    if (authorization && authorization.startsWith('Bearer ')) {
        request.token = authorization.replace('Bearer ', '')
        const decodedToken = jwt.verify(request.token, SECRET)
        if (!decodedToken.id) {
            request.user = null
        }else{
            request.user = await User.findById(decodedToken.id)
        }

    } else {
        request.token = null
        request.user = null
    }
    next()
}

module.exports = {
    unknownEndpoint,
    errorHandler,
    userExtractor
}