import React from 'react'
import { IoMdPlay } from 'react-icons/io'
import { useTheme } from '../provider/ThemeProvider'
import { getRandomGradientPair } from '../utils/helper'
import { useNavigate } from 'react-router'

const CourseCard = ({collection, course}) => {
    const [theme] = useTheme()
    const nav = useNavigate()
  return (
    <div className={`card ${theme}-shadow`}>
        <div className={`banner`} style={{backgroundImage: `linear-gradient(135deg, ${course.bgColor[0]}, ${course.bgColor[1]})`}}>
            <div className="title">{course.title}</div>
        </div>
        <div className={`metrics`}>
            <div className="chapters">
                <div className="count">{course.chapters}</div>
                <div className={`label mono-${theme}`}>Chapters</div>
            </div>
            <div className="items">
                <div className="count">{course.lessons}</div>
                <div className={`label mono-${theme}`}>Lessons</div>
            </div>
            <div className="progress" onClick={() => nav(`./${collection.slug}/${course.slug}`)}>
                <div className={`conic-progress secondary-${theme}-bg`}>
                    <div className={`enroll-btn primary-${theme}-bg`}></div>
                    <IoMdPlay />
                </div>
                <div className={`percentile midtone-${theme}`}>0%</div>
            </div>
        </div>
    </div>
  )
}

export default CourseCard