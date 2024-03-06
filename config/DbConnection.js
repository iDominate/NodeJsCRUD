const mongoose = require('mongoose')

const connectToMongo = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URI)
    } catch (error) {
        console.log(error.message)
    }
}

const closeDb = async () => {
    try {
        await mongoose.connection.close()
    } catch (error) {
        console.log(error.message)
    }
}


module.exports = { connectToMongo, closeDb } 
