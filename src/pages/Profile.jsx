import React, { useEffect, useState } from 'react'
import { Outlet, useNavigate, useParams } from 'react-router'
import { checkIfFollowing, followUser, getUserByUsername, unFollowUser } from '../utils/firestore'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { IoArrowBackOutline } from 'react-icons/io5'
import "../styles/profile.css"
import { useTheme } from '../provider/ThemeProvider'
import { AiOutlineMore } from 'react-icons/ai'
import { useUser } from '../provider/UserProvider'
import { Link, NavLink } from 'react-router-dom'
import { useToast } from '../provider/ToastProvider'

const Profile = () => {
    const { username } = useParams()
    const [theme] = useTheme()
    const [currentUser] = useUser()
    const [addToast] = useToast()
    const [isFollowPending, setIsFollowPending] = useState(false)
    const queryClient = useQueryClient()
    const nav = useNavigate()

    const { data: user, isLoading, refetch } = useQuery({
        queryKey: ["userdata"],
        queryFn: async () => await getUserByUsername(username)
    })

    const { data: isFollowing } = useQuery({
        queryKey: ["isFollowing", user?.uid],
        queryFn: async () => await checkIfFollowing(currentUser?.uid, user.uid)
    })


    const { mutate: mutateFollow } = useMutation({
        mutationFn: async () => await followUser(currentUser?.uid, user.uid),
        onMutate: () => {
            setIsFollowPending(true)
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["isFollowing", user?.uid])
            setIsFollowPending(false)
            addToast("Followed", `You are now following ${user?.username}`, "success")
        },
        onError: () => {
            setIsFollowPending(false)
        }
    })

    const { mutate: mutateUnFollow } = useMutation({
        mutationFn: async () => await unFollowUser(currentUser?.uid, user.uid),
        onMutate: () => {
            setIsFollowPending(true)
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["isFollowing", user?.uid])
            setIsFollowPending(false)
            addToast("Unfollowed", `You unfollowed ${user?.username}`, "info")
        },
        onError: () => {
            setIsFollowPending(false)
        }
    })


    useEffect(() => {
        refetch()
    }, [username, refetch])

    if (isLoading || username !== user?.username) return <div>Loading...</div>
  return (
    <div className={`profile-page primary-${theme}-bg midtone-${theme}`}>
        <div className="profile">
            <div className="header">
                <div className={`back ${theme}-hover`} onClick={() => nav(-1)}>
                    <IoArrowBackOutline />
                </div>
                <p>{user.uid === currentUser?.uid ? "Profile" : user.username}</p>
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
                        {user?.photoURL && <img src={user.photoURL} alt={user.displayName}/>}
                    </div>
                </div>
                <div className="bio">{user.bio}</div>
                <div className="metrics">
                    <div className={`reputation ${theme}-hover`}>
                        <div className="count">10</div>
                        <div className="title">Reputation</div>
                    </div>
                    <Link to={'following'} className={`following ${theme}-hover`}>
                        <div className="count">{user?.followingCount ? user?.followingCount : 0}</div>
                        <div className="title">Following</div>
                    </Link>
                    <Link to={'followers'} className={`followers ${theme}-hover`}>
                        <div className="count">{user?.followersCount ? user?.followersCount : 0}</div>
                        <div className="title">Followers</div>
                    </Link>
                </div>
                <div className="cta">
                {user.uid === currentUser?.uid ? 
                    <button className='edit'>Edit Profile</button> :
                    <>
                        <button className={`follow-btn ${isFollowing ? "following" : "follow"}`} onClick={() => isFollowing ? mutateUnFollow() : mutateFollow()} disabled={isFollowPending}>{isFollowing ? "Following" : "Follow"}</button>
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
            <Outlet context={[user, username, isLoading]}/>
        </div>
    </div>
  )
}

export default Profile