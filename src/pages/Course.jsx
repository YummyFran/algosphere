import React, { useEffect, useRef, useState } from 'react'
import { Outlet, useNavigate, useParams } from 'react-router'
import '../styles/course.css'
import { IoArrowBackOutline, IoMenu } from 'react-icons/io5'
import { NavLink } from 'react-router-dom'
import { useTheme } from '../provider/ThemeProvider'
import data from '../data/courses.json'

const Course = () => {
    const [courseData, setCourseData] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const [theme] = useTheme()
    const { collections } = data
    const { collectionSlug, courseSlug } = useParams()
    const nav = useNavigate()
    const chapterRef = useRef()

    const cols = collections.map(col => col.slug)
    const collection = collections[cols.indexOf(collectionSlug)]
    const courses = collection.courses.map(cor => cor.slug)
    const course = collection.courses[courses.indexOf(courseSlug)]

    const toggleChapterMenu = () => {
        chapterRef.current.classList.toggle('show')
    }

    useEffect(() => {
        const importJSON = async () => {
            try {
                setLoading(true)
                const json = await import(`../data/courses/${collectionSlug}/${courseSlug}.json`)
                setCourseData(json)
                setLoading(false)
            } catch (err) {
                setLoading(false)
                setError('Failed To load ' + courseSlug + ".json")
            }
        }

        importJSON()
    }, [courseSlug])

    if(loading && !courseData) return "Loading..."
    if(error) return error
  return (
    <div className={`course-page primary-${theme}-bg`}>
        <div className="hero" style={{backgroundImage: `linear-gradient(135deg, ${course.bgColor[0]}, ${course.bgColor[1]})`}}>
            <div className="header">
                <div className="back" onClick={() => nav(`/courses`)}>
                    <IoArrowBackOutline />
                    <span>Back to Courses</span>
                </div>
                <IoMenu className='burger-menu' onClick={toggleChapterMenu}/>
            </div>
            <h1 className="title">{courseData?.title}</h1>
        </div>
        <div className="content">
            <div className={`chapters secondary-${theme}-bg midtone-${theme}`} ref={chapterRef}>
                <div className="header">
                    <div className="title">Chapters</div>
                    <div className="close" onClick={toggleChapterMenu}>&times;</div>
                </div>
                <NavLink onClick={toggleChapterMenu} to={`/courses/${collectionSlug}/${courseSlug}`} end>Overview</NavLink>
                {courseData?.chapters.map((chapter, i) => {
                    return <NavLink onClick={toggleChapterMenu} key={i} to={`/courses/${collectionSlug}/${courseSlug}/${chapter.slug}`} className={({isActive}) => isActive ? "active" : ''}>{chapter.title}</NavLink>
                })}
            </div>
            <div className="lessons">
                <Outlet context={courseData}/>
            </div>
        </div>
    </div>
  )
}

export default Course