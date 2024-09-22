import React, { useRef } from 'react'
import { logOut } from '../utils/authentication'
import { NavLink } from 'react-router-dom'
import { AiOutlineMore } from 'react-icons/ai'
import logo from '../assets/logo.svg'

const LeftPanel = ({user, isLoading, menuRef}) => {

    const showMenu = () => {
        menuRef.current.classList.toggle("show")
    }
  return (
    <div className="left-panel">
        <div className="nav">
            <NavLink to="/" className="brand">
                <div className="logo">
                    <img src={logo} alt="" />
                </div>
                <div className="name">Algo <span>Sphere</span></div>
            </NavLink>
            <NavLink to="/" className={({isActive}) => isActive ? 'active-link' : ""}>Feed</NavLink>
            <NavLink to="/courses" className={({isActive}) => isActive ? 'active-link' : ""}>Courses</NavLink>
            <NavLink to="/problems" className={({isActive}) => isActive ? 'active-link' : ""}>Problems</NavLink>
            <NavLink to="/playground" className={({isActive}) => isActive ? 'active-link' : ""}>Playground</NavLink>
            <NavLink to="/saved" className={({isActive}) => isActive ? 'active-link' : ""}>Saved</NavLink>
        </div>
        <div className="shortcuts"></div>
        <div className="profile">
            <div className="display-picture"></div>
            <div className="name">
                <div className={`display-name ${isLoading && 'loading'}`}>{user?.displayName.split(" ")[0]}</div>
                <div className={`username ${isLoading && 'loading'}`}>{user && `@${user.username}`}</div>
            </div>
            <div className="meatball-menu" onClick={() => showMenu()}>
                <AiOutlineMore />
            </div>
            <div className="menu" ref={menuRef}>
                <div className="item" onClick={() => logOut()}>logout</div>
            </div>
        </div>
    </div>
  )
}

export default LeftPanel