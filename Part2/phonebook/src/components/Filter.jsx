const Filter = ({filtered, handleNewFilter}) => {
    return(
    <div>filter shown with: <input value={filtered} onChange={handleNewFilter}/></div>
    )
}

export default Filter