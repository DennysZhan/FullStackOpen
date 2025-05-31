const Info = ({addInfo, newName, handleNewName, newNumber, handleNewNumber}) => {
    return(
        <form onSubmit={addInfo}>
            <div>
            name: <input value={newName} onChange = {handleNewName}/>
            </div>
            <div>
            number: <input value={newNumber} onChange = {handleNewNumber} />
            </div>
            <div>
            <button type="submit">add</button>
            </div>
        </form>
    )
}

export default Info