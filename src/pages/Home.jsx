import React, { useEffect, useRef } from 'react'
import { useUser } from '../provider/UserProvider'
import { logOut } from '../utils/authentication'
import { Navigate } from 'react-router'
import '../styles/home.css'
import { Link, NavLink } from 'react-router-dom'

const Home = () => {
    const [user, loading] = useUser()
    const textAreaRef = useRef()

    useEffect(() => {
        if(!user) return

        const handleExpand = e => {
            e.target.style.height = 'auto'
            e.target.style.height = `${e.target.scrollHeight}px`
        }

        textAreaRef.current.addEventListener('input', handleExpand)

        return () => {
            textAreaRef.current.removeEventListener('input', handleExpand)
        }

    }, [])

    if(!user) return <Navigate to="/login"/>
    if(loading) return 'loading...'
  return (
    <div className='home'>
        <div className="left-panel">
            <div className="profile">
                <div className="display-picture"></div>
                <div className="display-name">{user.displayName}</div>
            </div>
            <div className="nav">
                <NavLink to="/">Feed</NavLink>
                <NavLink to="/courses">Courses</NavLink>
                <NavLink to="/problems">Problems</NavLink>
                <NavLink to="/playground">Playground</NavLink>
                <NavLink to="/saved">Saved</NavLink>
            </div>
            <div className="shortcuts"></div>
            <div className="options">
                <div className="toggle-theme"></div>
                <div className="settings"></div>
                <button onClick={() => logOut()}>Log out</button>
            </div>
        </div>
        <div className="feed">
            <div className="news">
                <div className="create-post">
                    <div className="context">
                        <div className="display-photo">
                            <div className="photo"></div>
                        </div>
                        <textarea ref={textAreaRef} name="post" id="post-input" rows='1' placeholder={`What's new, ${user.displayName}?`}></textarea>
                    </div>
                    <div className="attachments">
                        <button>Post</button>
                    </div>
                </div>
            </div>
        </div>
        <div className="right-panel"></div>
    </div>
  )
}

export default Home