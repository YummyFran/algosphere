import React, { useState } from 'react'
import '../styles/userItem.css'
import { useTheme } from '../provider/ThemeProvider'
import { useUser } from '../provider/UserProvider'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { checkIfFollowing, followUser, unFollowUser } from '../utils/firestore'
import { IoMdHeart } from 'react-icons/io'

const UserItem = ({userData, className}) => {
    const [theme] = useTheme()
    const [currentUser] = useUser()
    const [isFollowPending, setIsFollowPending] = useState(false)
    const queryClient = useQueryClient()

    const { data: isFollowing } = useQuery({
        queryKey: ["isFollowing", userData?.uid],
        queryFn: async () => await checkIfFollowing(currentUser?.uid, userData.uid)
    })

    const { mutate: mutateFollow } = useMutation({
        mutationFn: async () => await followUser(currentUser?.uid, userData.uid),
        onMutate: () => {
            setIsFollowPending(true)
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["isFollowing", userData?.uid])
            setIsFollowPending(false)
        },
        onError: () => {
            setIsFollowPending(false)
        }
    })

    const { mutate: mutateUnFollow } = useMutation({
        mutationFn: async () => await unFollowUser(currentUser?.uid, userData.uid),
        onMutate: () => {
            setIsFollowPending(true)
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["isFollowing", userData?.uid])
            setIsFollowPending(false)
        },
        onError: () => {
            setIsFollowPending(false)
        }
    })

  return (
    <div className='user-item'>
        <div className={`display-photo mono-${theme}-bg ${className}`}>
            {userData.photoURL && <img src={userData.photoURL} alt="dp"/>}
            {className === "liked" && <IoMdHeart className='heart'/>}
        </div>
        <div className="name">
            <div className="display-name">{userData.displayName}</div>
            <div className="username">@{userData.username}</div>
        </div>
        {userData.uid !== currentUser.uid &&
            <button 
                className={`${isFollowing ? 'following' : 'follow'} midtone-${theme}`} 
                onClick={e => {e.stopPropagation(); isFollowing ? mutateUnFollow() : mutateFollow()}} 
                disabled={isFollowPending}
            >
                {isFollowing ? "Following" : "Follow"}
            </button>
        }
        </div>
  )
}

export default UserItem