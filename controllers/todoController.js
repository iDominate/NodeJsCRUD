const Todo = require('../models/todo')
const generateTodos = require('../seeders/seedTodos')
const { v4 } = require('uuid')
const getAllTodos = () => {
    return Todo.find().exec()
}

const getASingleTodo = async (uuid) => {
    const todo = await Todo.find({ uuid: uuid }).exec()
    return todo
}

const createATodo = async (todo) => {
    const newTddo = await Todo.create(todo)
}

const updateATodo = async (id, newTodo) => {
    newTodo = await Todo.updateOne({ uuid: id }, newTodo)
    return newTodo
}

const deleteATodo = async (id) => {
    await Todo.deleteOne({ uuid: id })
    return id
}

const InsertBulkOnDbEmpty = async (number) => {
    if ((await Todo.find().exec()).length == 0) {
        const todos = generateTodos(number)
        console.log('-->Inserting data...')
        await Todo.insertMany(todos)
        console.log('Successfully seeded the data')
    } else {
        console.log('-->Db already populated')
        return
    }

}

module.exports = { InsertBulkOnDbEmpty, deleteATodo, updateATodo, getAllTodos, getASingleTodo, createATodo }