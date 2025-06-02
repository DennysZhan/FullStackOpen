import { useState, useEffect } from 'react'
import Search from './components/Search'
import countryService from './services/countries'
import Display from './components/Display'

function App() {

  const [search, setSearch] = useState('')
  const [countries, setCountries] = useState([])

  useEffect(() => {
    countryService
    .pull()
    .then(response => {
      setCountries(response.data)

    })
  }, [])

  const handleSetSearch = (event) => {
    console.log(event.target.value)
    setSearch(event.target.value)
  }

  return(
    <div>
      <Search onchange = {handleSetSearch}/>
      <Display search = {search} countriesList = {countries}/>
    </div>
  )
}

export default App
