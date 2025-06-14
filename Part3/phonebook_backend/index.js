const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const app = express()

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.use(cors())

app.use(express.json())

morgan.token('body', function (req, res) { return JSON.stringify(req.body)})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/info', (request, response) => {

    const currentTime = new Date()
    const timeString = currentTime.toString()
    response.send(`<p> Phone book has info for ${persons.length} people <p/><p>${timeString}<p/>`)
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find((note) => note.id === id)

    if(person){
        response.json(person)
    }
    else{
        response.status(404).end()
    }
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    if(!body.name || !body.number){
        response.status(400).json({error: 'missing content',})
    }

    const existingPerson = persons.find(person => person.name === body.name)
    if(existingPerson){
        return response.status(400).json({error: 'name must be unique'})
    }
    
    const person = {
        id: Math.floor(Math.random() * 1000) + 1,
        name: body.name,
        number: body.number
    }

    persons = persons.concat(person)
    response.json(person)
})

app.delete('/api/persons/:id', (request,response) => {
    const id = request.params.id

    persons = persons.filter((person) => person.id !== id)
    response.status(204).end()

})
const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})