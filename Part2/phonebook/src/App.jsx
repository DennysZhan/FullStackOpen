import { useState, useEffect } from 'react'
import axios from 'axios'
import Filter from './components/Filter'
import Info from './components/Info'
import DisplayPhonebook from './components/DisplayPhonebook'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', 
      number: '040-1234567'}
  ]) 

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filtered, setNewFilter] = useState('')

  useEffect(() => {
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        console.log('promise fulfilled')
        setPersons(response.data)
      })
  }, [])

  const addInfo = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber
    }
    const ifNameExists = persons.find(person => person.name === newName)

    if (ifNameExists){
      alert(`${newName} is already added to phonebook`)
    }
    else{
    setPersons([...persons, personObject])
    setNewName('')
    setNewNumber('')
    }
  }

  const handleNewName = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNewNumber = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const handleNewFilter = (event) => {
    console.log(event.target.value)
    setNewFilter(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filtered = {filtered} handleNewFilter = {handleNewFilter}/>
      <h2>Add a New</h2>
      <Info addInfo = {addInfo} newName = {newName} handleNewName = {handleNewName} newNumber = {newNumber} handleNewNumber = {handleNewNumber}/>
      <h2>Numbers</h2>
      <DisplayPhonebook filtered = {filtered} persons = {persons}/>
    </div>
  )
}

export default App
