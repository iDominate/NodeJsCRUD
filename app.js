const express = require('express')
require('dotenv').config()
const swaggerUI = require('swagger-ui-express')
const yaml = require('yamljs')
const swaggerJSDocs = yaml.load('./api.yaml')
const app = express()
const port = process.env.PORT || 5000
const { connectToMongo } = require('./config/DbConnection')
const mongoose = require('mongoose')
const { InsertBulkOnDbEmpty, createATodo } = require('./controllers/todoController')
const hidePoweredBy = require('hide-powered-by')
const cookieParser = require('cookie-parser')
const User = require('./models/user')
const verifyJWT = require('./middlewares/verifyJWT')
const validateJSON = require('./middlewares/validateJSON')
app.use(express.json())
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerJSDocs))
app.use(hidePoweredBy())
app.use(cookieParser())
app.use(validateJSON)
app.use('/auth', require('./routes/auth/registerRoute'))
app.use('/todos', verifyJWT, require('./routes/todoRoutes'))


User.createCollection().then((collection) => {
    console.log('collection is created')
})
connectToMongo()

InsertBulkOnDbEmpty(10)

app.all('*', (req, res) => {
    return res.json({ 'msg': 'endpoint not found' }).status(404)
})

mongoose.connection.once('connected', () => {
    console.log('Successfully connected Db')
    const server = app.listen(port, () => console.log(`Listening on port: ${port}`))
})


module.exports = app 