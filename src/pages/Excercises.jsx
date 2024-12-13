import React, { useEffect } from 'react'
import { useTheme } from '../provider/ThemeProvider'
import exercises from '../data/exercises.json'
import '../styles/exercises.css'
import Exercise from '../components/Exercise'

const Excercises = () => {
  const [theme] = useTheme()

  useEffect(() => {
      window.scrollTo({ top: 0, behavior: 'smooth'})
  }, [])
  return (
    <div className={`exercises primary-${theme}-bg midtone-${theme}`}>
      <div className="header">
        <h1>Exercises</h1>
      </div>
      {exercises.map((exercise, i) => {
        return (
          <Exercise key={i} exercise={exercise}/>
        )
      })}
    </div>
  )
}

export default Excercises