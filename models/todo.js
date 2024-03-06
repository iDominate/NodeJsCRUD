const mongoose = require('mongoose')

const todoSchema = new mongoose.Schema({
    uuid: String,
    title: String,
    description: String,
    completed: Boolean,
}, {
    versionKey: false, toJSON: {
        transform: function (doc, ret) {
            delete ret._id;
        }
    }
})

module.exports = mongoose.model("Todo", todoSchema)