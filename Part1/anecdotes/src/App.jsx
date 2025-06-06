import { useState } from 'react'

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]
   
  const [selected, setSelected] = useState(Math.floor(Math.random() * anecdotes.length))
  const [votes, setVotes] = useState(Array(8).fill(0))

  const generateRandomAnecdote = () => {
    const randomIndex = Math.floor(Math.random() * anecdotes.length)
    setSelected(randomIndex)
  }
  
  const voteAnecdote = () => {
    const newVotes = [...votes]
    newVotes[selected] = newVotes[selected] + 1
    setVotes(newVotes)
  }

  const mostVotes = () => {
    let max = 0
    let maxAnecdote = ""
    for (let i = 0; i < 8; i++){
      if (votes[i] > max){
        max = votes[i]
        maxAnecdote = anecdotes[i]
      }
    }
    return(
      maxAnecdote
    )
  }

  return (
    <div>
      <h1>Anecdote of the Day</h1>
      <p>{anecdotes[selected]}</p>
      <p>This anecdote has {votes[selected]} votes</p>
      <button onClick = {generateRandomAnecdote}>next anecdote</button>
      <button onClick = {voteAnecdote}>vote</button>
      <h1>Anecdote with most votes</h1>
      <p>{mostVotes()}</p>

    </div>
  )
}

export default App
