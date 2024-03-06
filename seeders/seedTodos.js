const { fakerEN } = require('@faker-js/faker')
const uuid = require('uuid')


const generateTodos = (number) => {
    const todos = []
    for (let i = 0; i < number; i++) {
        const todo = {
            uuid: uuid.v4(),
            title: fakerEN.lorem.sentences(1),
            description: fakerEN.lorem.paragraph(4),
            completed: fakerEN.datatype.boolean()
        }
        todos.push(todo)
    }
    return todos
}

module.exports = generateTodos