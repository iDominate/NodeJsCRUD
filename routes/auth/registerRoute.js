const { register, login } = require('../../controllers/authController')
const express = require('express')
const router = express.Router()
const generateResponse = require('../../response/response')
const { verify, sign } = require('jsonwebtoken')
const verifyJWT = require('../../middlewares/verifyJWT')

router.post('/register', async (req, res) => {
    let { firstName, lastName, email, password, userName } = req.body
    console.log(firstName, lastName, email, password, userName)
    if (!firstName || !lastName || !email || !password || !userName) {
        return res.json({ 'msg': 'missing fields' }).json(400)

    }
    let newUser = {
        firstName,
        lastName,
        email,
        password,
        userName
    }
    const success = await register(newUser)
    const result = {
        firstName,
        lastName,
        email,
        userName
    }
    if (!success) {

        return res.json({ 'msg': 'user already exists' })

    }
    let response = generateResponse(result)
    res.json(response).status(201)
})

router.post('/login', async (req, res) => {
    let { userName, password } = req.body
    if (!userName || !password) {
        return res.json({ 'msg': 'missing fields' }).status(400)

    }
    const result = await login(userName, password)
    if (!result) {
        return res.json({ 'msg': 'invalid credentials' }).status(400)
    }
    const refreshToken = result.refreshToken
    const accessToken = result.accessToken
    res.cookie('jwt', refreshToken, { httpOnly: true })
    let response = generateResponse({ 'accessToken': accessToken })
    return res.json(response)
})

router.post('/refresh', verifyJWT, (req, res) => {
    let cookie = req.cookies['jwt']
    if (!cookie) {
        return res.status(403).json(generateResponse('forbidden', 403, true))
    }
    verify(cookie, process.env.REFRESH_TOKEN_SECRET, (err, decode) => {
        if (err) {
            console.log(err.message)
            let response = generateResponse('token has expired, please sign in again', 403, true)
            return res.status(403).json(response)
        } else {
            let userName = res.locals?.userName
            let accessToken = sign({ userName }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15 minutes' })
            let refreshToken = sign({ userName }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' })
            res.cookie('jwt', refreshToken)
            let response = generateResponse({ accessToken })
            return res.status(200).json(response)
        }

    })
})

module.exports = router

