const bcrypt = require('bcrypt')
const User = require('../models/user')
const jsonwebtoken = require('jsonwebtoken')

const register = async (user) => {
    console.log(`${user.userName}`)
    let doesUSerAlreadyExist = await User.find({ userName: user.userName }).exec()
    if (doesUSerAlreadyExist.length != 0) {
        return false
    }
    user.password = await bcrypt.hash(user.password, 10)
    user.refreshToken = null
    await User.create(user)
    return true

}
/**
 * 
 * @param {String} userName 
 * @param {String} password 
 * @returns {Boolean} operation result
 */
const login = async (userName, password) => {
    let existingUser = await User.findOne({ userName }).exec()
    if (!existingUser) {
        return false
    }
    let isPasswordCorrect = await bcrypt.compare(password, existingUser.password)


    if (!isPasswordCorrect) {
        return false
    }
    let accessToken = jsonwebtoken.sign({ 'userName': existingUser }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15 minutes' })
    let refreshToken = jsonwebtoken.sign({ 'userName': existingUser }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' })
    existingUser.refreshToken = refreshToken
    existingUser.save()
    //User.updateOne({ '_id': existingUser._id }, existingUser)
    return { accessToken, refreshToken }
}



module.exports = { register, login }