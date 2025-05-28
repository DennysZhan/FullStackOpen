import { useState } from 'react'

const Header = ({heading}) => {
  return(
    <h1>{heading}</h1>
  )
}

const Button = ({onClick, text}) => {
  return(
  <button onClick = {onClick}>{text}</button>
  )
}

const StatisticLine = ({type, number}) => {
  return(
    <tr>
      <td>{type}</td>
      <td>{number}</td>
    </tr>
  )
}

const Statistics = ({good, neutral, bad}) => {
  const all = good + neutral + bad
  if (all === 0){
    return(
      <div>
        No feedback given
      </div>
    )
  }
  return(
  <div>
    <table>
      <tbody>
        <StatisticLine type = {"good"} number = {good}/>
        <StatisticLine type = {"neutral"} number = {neutral}/>
        <StatisticLine type = {"bad"} number = {bad}/>
        <StatisticLine type = {"all"} number = {all}/>
        <StatisticLine type = {"average"} number = {(good - bad)/all}/>
        <StatisticLine type = {"positve"} number = {`${good/all * 100}%`}/>
      </tbody>
    </table>
  </div>
  )
}




const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleGoodClick = () => {
    setGood(good + 1)
  }

  const handleNeutralClick = () => {
    setNeutral(neutral + 1)
  }

  const handleBadClick = () => {
    setBad(bad + 1)
  }

  return (
    <div>
      <Header heading = {"give feedback"}/>
      <Button onClick = {handleGoodClick} text = {"good"}/>
      <Button onClick = {handleNeutralClick} text = {"neutral"}/>
      <Button onClick = {handleBadClick} text = {"bad"}/>
      <Header heading = {"statistics"}/>
      <Statistics good = {good} neutral = {neutral} bad = {bad}/>
    </div>
  )
}

export default App
