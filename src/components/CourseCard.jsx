import React from 'react'
import { IoMdPlay } from 'react-icons/io'
import { useTheme } from '../provider/ThemeProvider'
import { getRandomGradientPair } from '../utils/helper'

const CourseCard = ({course}) => {
    const [theme] = useTheme()
  return (
    <div className={`card ${theme}-shadow`}>
        <div className={`banner`} style={{backgroundImage: `${getRandomGradientPair()}`}}>
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
            <div className="progress">
                <div className={`enroll-btn secondary-${theme}-bg`}>
                    <div className={`conic-progress primary-${theme}-bg`}></div>
                    <IoMdPlay />
                </div>
                <div className={`percentile midtone-${theme}`}>0%</div>
            </div>
        </div>
    </div>
  )
}

export default CourseCard