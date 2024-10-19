import React, { useEffect } from 'react'
import { Outlet, useNavigate, useParams } from 'react-router'
import { getUserByUsername } from '../utils/firestore'
import { useQuery } from '@tanstack/react-query'
import { IoArrowBackOutline } from 'react-icons/io5'
import "../styles/profile.css"
import { useTheme } from '../provider/ThemeProvider'
import { AiOutlineMore } from 'react-icons/ai'
import { useUser } from '../provider/UserProvider'
import { NavLink } from 'react-router-dom'

const Profile = () => {
    const { username } = useParams()
    const [theme, setTheme] = useTheme()
    const [currentUser, loading] = useUser()
    const nav = useNavigate()

    const { data: user, isLoading, refetch } = useQuery({
        queryKey: ["userdata"],
        queryFn: async () => await getUserByUsername(username)
    })

    useEffect(() => {
        refetch()
    }, [username, refetch])

    console.log(currentUser)

    if (isLoading || username != user?.username) return <div>Loading...</div>
  return (
    <div className={`profile-page primary-${theme}-bg midtone-${theme}`}>
        <div className="profile">
            <div className="header">
                <div className={`back ${theme}-hover`} onClick={() => nav(-1)}>
                    <IoArrowBackOutline />
                </div>
                <p>{user.uid == currentUser?.uid ? "Profile" : user.username}</p>
                <div className={`meatball ${theme}-hover`}>
                    <AiOutlineMore />
                </div>
            </div>
            <div className="profile-card">
                <div className="profile-details">
                    <div className="display-names">
                        <div className="name">{user.displayName}</div>
                        <div className="username">@{user.username}</div>
                    </div>
                    <div className={`profile-picture secondary-${theme}-bg`}>
                        <img src={user.photoURL} />
                    </div>
                </div>
                <div className="bio">{user.bio}</div>
                <div className="metrics">
                    <div className={`reputation ${theme}-hover`}>
                        <div className="count">10</div>
                        <div className="title">Reputation</div>
                    </div>
                    <div className={`following ${theme}-hover`}>
                        <div className="count">0</div>
                        <div className="title">Following</div>
                    </div>
                    <div className={`followers ${theme}-hover`}>
                        <div className="count">0</div>
                        <div className="title">Followers</div>
                    </div>
                </div>
                <div className="cta">
                {user.uid === currentUser?.uid ? 
                    <button className='edit'>Edit Profile</button> :
                    <>
                        <button className='follow'>Follow</button>
                        <button className='message'>Message</button>
                    </>
                }
                </div>
            </div>
            <div className="profile-nav">
                <NavLink to={`/${user.username}`} className={({ isActive }) => `${isActive ? 'active-link' : ''}`} end replace>Posts</NavLink>
                <NavLink to={`wall`} className={({ isActive }) => `${isActive ? 'active-link' : ''}`} replace>Wall</NavLink>
                <NavLink to={`reposts`} className={({ isActive }) => `${isActive ? 'active-link' : ''}`} replace>Reposts</NavLink>
            </div>
            <Outlet />
        </div>
    </div>
  )
}

export default Profile