import axios from 'axios'
const baseUrl = 'http://localhost:3001/api/persons'

const getAll = () =>{
    return axios.get(baseUrl)
}

const update = (personObject) => {
    return( 
        axios.post(baseUrl,personObject)
    )
}

const remove = (id) => {
    return(
        axios.delete(`${baseUrl}/${id}`)
    )
}

const updateNumber = (id, changePerson) => {
    return(
        axios.put(`${baseUrl}/${id}`, changePerson)
    )
}
export default {getAll, update, remove, updateNumber}