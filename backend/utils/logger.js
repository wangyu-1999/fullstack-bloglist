const {NODE_ENV} = require('./config')

const info = (...params) => {
    if (NODE_ENV !== 'test') {
        console.log(...params)
    }
    return null
}

const error = (...params) => {
    if (NODE_ENV !== 'test') {
        console.error(...params)
    }
    return null
}

module.exports = {
    info, error
}