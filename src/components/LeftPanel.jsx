import React from 'react'
import { logOut } from '../utils/authentication'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
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
    IoMenu
} from "react-icons/io5";
import { useToast } from '../provider/ToastProvider'


const LeftPanel = ({user, isLoading, menuRef, menuMobileRef}) => {
    const [theme, setTheme] = useTheme()
    const [addToast] = useToast()
    const {pathname} = useLocation()
    const nav = useNavigate()

    const showMenu = e => {
        e.stopPropagation()
        menuRef.current.classList.toggle("show")
        menuMobileRef.current.classList.toggle("show")
    }

    const handleThemeChange = () => {
        setTheme()
        if(theme === 'dark') {
            addToast('Light Mode Enabled', 'Back to the classic, bright view.')
        } else {
            addToast('Dark Mode Enabled', 'Enjoy a darker, more comfortable viewing experience.')
        }
    }

  return (
    <div className={`left-panel primary-${theme}-bg midtone-${theme}`}>
        <div className="nav mobile">
            <NavLink to="/" className={({isActive}) => `${isActive ? 'active-link' : ""} ${theme}-hover`}>
                {pathname === '/' ? <GoHomeFill /> : <GoHome />}
                <span>Feed</span>
            </NavLink>
            <NavLink to="/courses" className={({isActive}) => `${isActive ? 'active-link' : ""} ${theme}-hover`}>
                {pathname === '/courses' ? <IoBook /> : <IoBookOutline />} 
                <span>Courses</span>
            </NavLink>
            <NavLink to="/exercises" className={({isActive}) => `${isActive ? 'active-link' : ""} ${theme}-hover`}>
                {pathname === '/exercises' ? <IoExtensionPuzzle /> : <IoExtensionPuzzleOutline />} 
                <span>Exercises</span>
            </NavLink>
            <NavLink to="/playground" className={({isActive}) => `${isActive ? 'active-link' : ""} ${theme}-hover`}>
                {pathname === '/playground' ? <IoCodeSharp /> : <IoCodeOutline />}
                <span>Playground</span>
            </NavLink>
            <div className={`profile ${theme}-hover mobile`} onClick={() => nav(`/${user?.username}`)}>
                <div className="meatball-menu" onClick={e => showMenu(e)}>
                    <IoMenu />
                </div>
                <div className={`menu primary-${theme}-bg ${theme}-shadow`} ref={menuMobileRef} onClick={e => e.stopPropagation()}>
                    <div className="user" onClick={() => nav(`/${user?.username}`)}>
                        <div className="display-picture"></div>
                        <div className="name">
                            <div className={`display-name ${isLoading && 'loading'}`}>{user?.displayName.split(" ")[0]}</div>
                            <div className={`username ${isLoading && 'loading'}`}>{user && `@${user.username}`}</div>
                        </div>
                    </div>
                    <div className="theme" onClick={() => handleThemeChange()}>{`Turn on ${theme === 'dark' ? 'light' : 'dark'} mode`}</div>
                    <div className="item" onClick={() => logOut()}>Logout</div>
                </div>
            </div>
        </div>
        <div className="nav">
            <NavLink to="/" className="brand">
                <div className="logo">
                    <img src={`${process.env.PUBLIC_URL}/assets/logo.svg`} alt="algosphere logo" />
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
            <NavLink to="/exercises" className={({isActive}) => `${isActive ? 'active-link' : ""} ${theme}-hover`}>
                {pathname === '/exercises' ? <IoExtensionPuzzle /> : <IoExtensionPuzzleOutline />} 
                <span>Exercises</span>
            </NavLink>
            <NavLink to="/playground" className={({isActive}) => `${isActive ? 'active-link' : ""} ${theme}-hover`}>
                {pathname === '/playground' ? <IoCodeSharp /> : <IoCodeOutline />}
                <span>Playground</span>
            </NavLink>
        </div>
        <div className="shortcuts"></div>
        <div className={`profile ${theme}-hover`} onClick={() => nav(`/${user?.username}`)}>
            <div className="display-picture">
                {user?.photoURL && <img src={user.photoURL} alt={user?.displayName}/>}
            </div>
            <div className="name">
                <div className={`display-name ${isLoading && 'loading'}`}>{user?.displayName.split(" ")[0]}</div>
                <div className={`username ${isLoading && 'loading'}`}>{user && `@${user.username}`}</div>
            </div>
            <div className="meatball-menu" onClick={showMenu}>
                <AiOutlineMore />
            </div>
            <div className={`menu primary-${theme}-bg ${theme}-shadow`} ref={menuRef} onClick={e => e.stopPropagation()}>
                <div className="theme" onClick={() => handleThemeChange()}>{`Turn on ${theme === 'dark' ? 'light' : 'dark'} mode`}</div>
                <div className="item" onClick={() => logOut()}>Logout</div>
            </div>
        </div>
    </div>
  )
}

export default LeftPanel