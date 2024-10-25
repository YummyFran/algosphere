import React from 'react'
import CourseCard from './CourseCard'
import { useTheme } from '../provider/ThemeProvider'

const Collection = ({collection}) => {
    const [theme] = useTheme()
  return (
    <div className='collection'>
        <h2 className={`collection-name midtone-${theme}`}>{collection.name}</h2>
        <div className="courses-list">
        {
            collection.courses.map((course, index) => 
                <CourseCard key={index} collection={collection} course={course}/>
            )
        }
        </div>
    </div>
  )
}

export default Collection