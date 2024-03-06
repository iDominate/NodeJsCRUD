const express = require('express')
const router = express.Router()
const controller = require('../controllers/todoController')
const { v4 } = require('uuid')
const generateResponse = require('../response/response')

router.get('/', async (req, res) => {
    return res.json(await controller.getAllTodos())
})


router.get('/:id', async (req, res) => {
    let id = req.params.id
    try {
        let todo = await controller.getASingleTodo(id)
    } catch (error) {
        let response = generateResponse(error.message, 400, true)
        return res.status(400).json(response)
    }
    if (!todo)
        res.status(404).json(generateResponse('not found', 404, true))
    return res.json(todo)
})

router.put('/:id', async (req, res) => {
    let id = req.params.id
    let { title, description } = req.body
    console.log([title, description])
    if (!title || !description)
        return res.json(generateResponse('missing fields', 400, true))
    try {
        let todo = await controller.getASingleTodo(id)
    } catch (error) {
        let response = generateResponse(error.message, 400, true)
        return res.status(400).json(response)
    }
    if (!todo)
        return res.status(404).json(generateResponse('not found', 404, true))
    let newTodo = {
        uuid: id,
        title,
        description,
        completed: false
    }
    try {
        await controller.updateATodo(id, newTodo)
    } catch (error) {
        let response = generateResponse(error.message, 400, true)
        return res.status(400).json(response)
    }
    return res.json(generateResponse(newTodo))

})

router.delete('/:id', async (req, res) => {
    let id = req.params.id
    if (!id)
        return res.status(400).json({ 'msg': 'missing fields' })
    try {
        let todo = await controller.getASingleTodo(id)
    } catch (error) {
        let response = generateResponse(error.message, 400, true)
        return res.status(400).json(response)
    }
    if (!todo)
        res.status(404).json({ 'msg': 'not found' })
    try {
        await controller.deleteATodo(id)
    } catch (error) {
        let response = generateResponse(error.message, 400, true)
        return res.status(400).json(response)
    }
    return res.status(204)
})

router.post('/:id', async (req, res) => {
    let { title, description, completed } = req.body
    if (!title || !description) {
        res.status(400).json(generateResponse('missing fields', 400, true))
    }
    if (!completed) {
        completed = false
    }
    let newTodo = {
        uuid: v4(),
        title,
        description,
        completed
    }
    try {
        await controller.createATodo(newTodo)
    } catch (error) {
        let response = generateResponse(error.message, 400, true)
        return res.status(400).json(response)
    }
    return res.status(201).json(generateResponse(newTodo, 201))
})

module.exports = router