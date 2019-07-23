const jwt = require('jsonwebtoken')
const User = require('../db').import('../models/user')

const validateSession = (req, res, next) => {
    const token = req.headers.authorization
    jwt.verify(token, 'jwt_secret', (err, decodedToken) => {
        if (!err && decodedToken) {
            User.findOne({ where: { id: decodedToken.id }})
            .then(user => {
                if (!user) throw 'err'
                req.user = user
                return next()
            })
            .catch(err => next(err))
        } else {
            req.errors = err
            return next()
        }
    })
}

module.exports = validateSession