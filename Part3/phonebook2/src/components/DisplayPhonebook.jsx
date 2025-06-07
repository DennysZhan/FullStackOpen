import DeleteButton from "./deleteButton";

const DisplayPhonebook = ({filtered, persons, command}) => {

  const filteredList = (filtered) => {
    if (filtered === ''){
      return persons;
    } else{
      return (
        persons.filter(person => person.name.toLowerCase().includes(filtered.toLowerCase()))
      )
    }
  }

    return(
        <div>
            {filteredList(filtered).map((person) => (
            <div key={person.id}>
              {person.name}: {person.number}
              <DeleteButton person = {person} command = {command}/>
            </div>
            ))}
        </div>
    )
}

export default DisplayPhonebook