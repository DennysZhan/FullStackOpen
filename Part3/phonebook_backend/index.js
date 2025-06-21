require('dotenv').config()

const Person = require('./models/person')

const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

mongoose.set('strictQuery',false)
mongoose.connect(url)

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
    response.send(`<p> Phonebook has info for ${persons.length} people <p/><p>${timeString}<p/>`)
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/api/persons/:id', (request, response) => {
    Note.findById(request.params.id).then(note => {
        response.json(note)
    })
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    if(!body.name || !body.number){
        response.status(400).json({error: 'missing content',})
    }

    //const existingPerson = persons.find(person => person.name === body.name)
    //if(existingPerson){
    //    return response.status(400).json({error: 'name must be unique'})
    //}
    
    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
})

app.delete('/api/persons/:id', (request,response) => {
    const id = request.params.id

    persons = persons.filter((person) => person.id !== id)
    response.status(204).end()

})
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})