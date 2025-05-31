const DisplayPhonebook = ({filtered, persons}) => {

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
            {filteredList(filtered).map((person, index) => (
            <div key = {index}>{person.name}: {person.number}</div>
        ))}
        </div>
    )
}

export default DisplayPhonebook