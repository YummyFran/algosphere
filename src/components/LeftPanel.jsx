import React from 'react'
import { logOut } from '../utils/authentication'
import { NavLink, useLocation } from 'react-router-dom'
import { AiOutlineMore } from 'react-icons/ai'
import { useTheme } from '../provider/ThemeProvider'
import { GoHome, GoHomeFill } from "react-icons/go";
import { 
    IoBookOutline, 
    IoBook, 
    IoExtensionPuzzleOutline,
     IoExtensionPuzzle, 
     IoCodeOutline, 
     IoCodeSharp, 
     IoBookmarkOutline, 
     IoBookmark, 
     IoMenu
} from "react-icons/io5";
import logo from '../assets/logo.svg'


const LeftPanel = ({user, isLoading, menuRef, menuMobileRef}) => {
    const [theme, setTheme] = useTheme()
    const {pathname} = useLocation()

    const showMenu = () => {
        menuRef.current.classList.toggle("show")
        menuMobileRef.current.classList.toggle("show")
    }

  return (
    <div className={`left-panel primary-${theme}-bg midtone-${theme}`}>
        <div className="nav mobile">
            <NavLink to="/" className="brand">
                <div className="logo">
                    <img src={logo} alt="" />
                </div>
                <div className="name">AlgoSphere</div>
            </NavLink>
            <NavLink to="/" className={({isActive}) => `${isActive ? 'active-link' : ""} ${theme}-hover`}>
                {pathname === '/' ? <GoHomeFill /> : <GoHome />}
                <span>Feed</span>
            </NavLink>
            <NavLink to="/courses" className={({isActive}) => `${isActive ? 'active-link' : ""} ${theme}-hover`}>
                {pathname === '/courses' ? <IoBook /> : <IoBookOutline />} 
                <span>Courses</span>
            </NavLink>
            <NavLink to="/problems" className={({isActive}) => `${isActive ? 'active-link' : ""} ${theme}-hover`}>
                {pathname === '/problems' ? <IoExtensionPuzzle /> : <IoExtensionPuzzleOutline />} 
                <span>Problems</span>
            </NavLink>
            <NavLink to="/playground" className={({isActive}) => `${isActive ? 'active-link' : ""} ${theme}-hover`}>
                {pathname === '/playground' ? <IoCodeSharp /> : <IoCodeOutline />}
                <span>Playground</span>
            </NavLink>
            <NavLink to="/saved" className={({isActive}) => `${isActive ? 'active-link' : ""} ${theme}-hover`}>
                {pathname === '/saved' ? <IoBookmark /> : <IoBookmarkOutline />}
                <span>Saved</span>
            </NavLink>
            <div className={`profile ${theme}-hover mobile`}>
                <div className="meatball-menu" onClick={() => showMenu()}>
                    <IoMenu />
                </div>
                <div className={`menu primary-${theme}-bg ${theme}-shadow`} ref={menuMobileRef}>
                    <div className="user">
                        <div className="display-picture"></div>
                        <div className="name">
                            <div className={`display-name ${isLoading && 'loading'}`}>{user?.displayName.split(" ")[0]}</div>
                            <div className={`username ${isLoading && 'loading'}`}>{user && `@${user.username}`}</div>
                        </div>
                    </div>
                    <div className="theme" onClick={() => setTheme()}>{`Turn on ${theme === 'dark' ? 'light' : 'dark'} mode`}</div>
                    <div className="item" onClick={() => logOut()}>Logout</div>
                </div>
            </div>
        </div>
        <div className="nav">
            <NavLink to="/" className="brand">
                <div className="logo">
                    <img src={logo} alt="" />
                </div>
                <div className="name">AlgoSphere</div>
            </NavLink>
            <NavLink to="/" className={({isActive}) => `${isActive ? 'active-link' : ""} ${theme}-hover`}>
                {pathname === '/' ? <GoHomeFill /> : <GoHome />}
                <span>Feed</span>
            </NavLink>
            <NavLink to="/courses" className={({isActive}) => `${isActive ? 'active-link' : ""} ${theme}-hover`}>
                {pathname === '/courses' ? <IoBook /> : <IoBookOutline />} 
                <span>Courses</span>
            </NavLink>
            <NavLink to="/problems" className={({isActive}) => `${isActive ? 'active-link' : ""} ${theme}-hover`}>
                {pathname === '/problems' ? <IoExtensionPuzzle /> : <IoExtensionPuzzleOutline />} 
                <span>Problems</span>
            </NavLink>
            <NavLink to="/playground" className={({isActive}) => `${isActive ? 'active-link' : ""} ${theme}-hover`}>
                {pathname === '/playground' ? <IoCodeSharp /> : <IoCodeOutline />}
                <span>Playground</span>
            </NavLink>
            <NavLink to="/saved" className={({isActive}) => `${isActive ? 'active-link' : ""} ${theme}-hover`}>
                {pathname === '/saved' ? <IoBookmark /> : <IoBookmarkOutline />}
                <span>Saved</span>
            </NavLink>
        </div>
        <div className="shortcuts"></div>
        <div className={`profile ${theme}-hover`}>
            <div className="display-picture"></div>
            <div className="name">
                <div className={`display-name ${isLoading && 'loading'}`}>{user?.displayName.split(" ")[0]}</div>
                <div className={`username ${isLoading && 'loading'}`}>{user && `@${user.username}`}</div>
            </div>
            <div className="meatball-menu" onClick={() => showMenu()}>
                <AiOutlineMore />
            </div>
            <div className={`menu primary-${theme}-bg ${theme}-shadow`} ref={menuRef}>
                <div className="theme" onClick={() => setTheme()}>{`Turn on ${theme === 'dark' ? 'light' : 'dark'} mode`}</div>
                <div className="item" onClick={() => logOut()}>Logout</div>
            </div>
        </div>
    </div>
  )
}

export default LeftPanel