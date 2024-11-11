import React from 'react'
import { AiOutlineMore } from 'react-icons/ai'
import { IoArrowBackOutline } from 'react-icons/io5'
import { useTheme } from '../provider/ThemeProvider'
import { Outlet, useNavigate, useParams } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { getUserByUsername } from '../utils/firestore'
import { useUser } from '../provider/UserProvider'
import '../styles/metrics.css'
import { NavLink } from 'react-router-dom'

const Metrics = () => {
    const [currentUser] = useUser();
    const [theme] = useTheme();
    const { username } = useParams();
    const nav = useNavigate();

    const { data: user, isLoading, refetch } = useQuery({
        queryKey: ["userdata"],
        queryFn: async () => await getUserByUsername(username)
    })

    if (isLoading || username != user?.username) return <div>Loading...</div>
  return (
    <div className={`metrics-page primary-${theme}-bg midtone-${theme}`}>
        <div className="metrics">
            <div className="header">
                <div className={`back ${theme}-hover`} onClick={() => nav(-1)}>
                    <IoArrowBackOutline />
                </div>
                <p>{user?.uid == currentUser?.uid ? "Profile" : user?.username}</p>
                <div className={`meatball ${theme}-hover`}>
                    <AiOutlineMore />
                </div>
            </div>
            <nav>
                <NavLink to={`following`} className={({isActive}) => `midtone-${theme} ${isActive ? 'active' : ''}`} replace>Following</NavLink>
                <NavLink to={`followers`} className={({isActive}) => `midtone-${theme} ${isActive ? 'active' : ''}`} replace>Followers</NavLink>
            </nav>
            <Outlet context={user?.uid}/>
        </div>
    </div>
  )
}

export default Metrics