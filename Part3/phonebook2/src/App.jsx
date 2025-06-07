import { useState, useEffect } from 'react'
import './index.css'
import Filter from './components/Filter'
import Info from './components/Info'
import DisplayPhonebook from './components/DisplayPhonebook'
import personService from './services/persons'
import Notification from './components/Notification'
import ErrorMessage from './components/ErrorMessage'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filtered, setNewFilter] = useState('')
  const [message, setMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(response => {
        setPersons(response.data)
      })
  }, [])

  const addInfo = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber,
      id: (persons.length + 1).toString()
    }
    const ifNameExists = persons.find(person => person.name === newName)

    if (ifNameExists){
      if (window.confirm(`${newName} is already added to phonebook. Do you want to replace the old number with a new one?`)){
        const changedPerson = {...ifNameExists, number: newNumber}
        personService
          .updateNumber(ifNameExists.id, changedPerson)
          .then(response => {
            setPersons(persons.map(person => person.id !== ifNameExists.id ? person : response.data))
            setNewName('')
            setNewNumber('')
            setMessage(`Changed the phone number of ${ifNameExists.name}`)
            setTimeout(() => {setMessage(null)}, 5000)
          })
          .catch(error => {
            setErrorMessage(`Information of ${ifNameExists.name} was already removed from server`)
            setTimeout(() => {setErrorMessage(null)}, 5000)
          })
      }
    }
    else{
      personService
        .update(personObject)
        .then(response => {
          setPersons([...persons, response.data])
          setNewName('')
          setNewNumber('')
          setMessage(`Added ${personObject.name}`)
          setTimeout(() => {setMessage(null)}, 5000)
        })
    }
  }

  const removePerson = (person) => {

    if (window.confirm(`Are you sure you want to remove ${person.name}?`)){
      personService
      .remove(person.id)
      .then(() =>{
        setPersons(persons.filter(p => p.id !== person.id))
      })
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
      <ErrorMessage message = {errorMessage} />
      <Notification message = {message} />
      <Filter filtered = {filtered} handleNewFilter = {handleNewFilter}/>
      <h2>Add a New</h2>
      <Info addInfo = {addInfo} newName = {newName} handleNewName = {handleNewName} newNumber = {newNumber} handleNewNumber = {handleNewNumber}/>
      <h2>Numbers</h2>
      <DisplayPhonebook filtered = {filtered} persons = {persons} command = {removePerson}/>
    </div>
  )
}

export default App
