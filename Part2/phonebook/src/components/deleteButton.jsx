const DeleteButton = ({person, command}) => {

    return(
    <button onClick = {() => command(person)}>Delete</button>
    )
}

export default DeleteButton