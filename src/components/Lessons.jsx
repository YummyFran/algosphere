import React from 'react'
import { useOutletContext, useParams } from 'react-router'
import { Link } from 'react-router-dom'
import { useTheme } from '../provider/ThemeProvider'

const Lessons = () => {
    const {lessonSlug} = useParams()
    const [theme] = useTheme()
    const courseData = useOutletContext()
    const chapters = courseData?.chapters.map(chap => chap.slug)
    const chapter = courseData?.chapters[chapters.indexOf(lessonSlug)]

  return (
    <div className={`lessons-outlet midtone-${theme}`}>
      <div className="header">
        <h2 className="title">{chapter?.title}</h2>
        <p className="desc">{chapter?.description}</p>
      </div>
      <div className="links">
        {chapter?.lessons.map((lesson, i) => {
          return (
            <Link to={`./${i+1}`} key={i} className={`secondary-${theme}-bg midtone-${theme}`} replace>{lesson.title}</Link>
          )
        })}
      </div>
    </div>
  )
}

export default Lessons