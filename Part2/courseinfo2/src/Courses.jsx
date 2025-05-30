const Courses = ({courses}) => {
  return(
    <div>
      <h1> Web Development Cirriculum</h1>
      {courses.map(course =>
      <div key = {course.id}>
        <Header course = {course}/>
        <Content course = {course}/>
        <Total course = {course}/>
      </div>)}
    </div>
    
  )
}
const Header = ({course}) => {
  return(
  <div>
    <h3>{course.name}</h3>
  </div>
  )
}

const Content = ({course}) => {
  return(
    <div>
      {course.parts.map(part => 
      <div key = {part.id}>
        {part.name}: {part.exercises}
      </div>)}
    </div>
  )
}

const Total = ({course}) => {
  return(
  <div>
    <p>Number of exercises: {course.parts.reduce((sum, part) => sum + part.exercises, 0)} </p>
  </div>
  )
}

export default Courses