const jsonwebtoken = require('jsonwebtoken')


const verifyJWT = (req, res, next) => {
    const jwt = req.headers['authorization']?.split(' ')[1]
    if (!jwt) {
        return res.status(403).json({ 'msg': 'forbidden' })
    }
    jsonwebtoken.verify(jwt, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ 'msg': err.message })
        } else {
            res.locals.userName = decoded.userName.userName
            next()
        }
    })
}

module.exports = verifyJWT