const mongoose = require('mongoose')

const userModel = mongoose.Schema({
    firstName: String,
    lastName: String,
    userName: String,
    password: String,
    email: String,
    refreshToken: String,
    usedTokens: [String]
}, {
    versionKey: false, toJSON: {
        transform: function (doc, ret) {
            delete ret._id;
        }
    }
})



module.exports = mongoose.model('User', userModel)
