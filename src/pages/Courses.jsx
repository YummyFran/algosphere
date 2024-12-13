import React, { useEffect } from 'react'
import Collection from '../components/Collection'
import data from '../data/courses.json'
import '../styles/courses.css'
import { useTheme } from '../provider/ThemeProvider'

const Courses = () => {
  const { collections } = data
  const [theme] = useTheme()

  useEffect(() => {
      window.scrollTo({ top: 0, behavior: 'smooth'})
  }, [])
  return (
    <div className={`courses primary-${theme}-bg midtone-${theme}`}>
      <div className="header">
        <h1>Courses</h1>
      </div>
      {
        collections.map((collection, index) => {
          return (
            <Collection key={index} collection={collection}/>
          )
        })
      }
    </div>
  )
}

export default Courses