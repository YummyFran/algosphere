import { useQuery } from '@tanstack/react-query'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { getLikedUsers, getUser } from '../utils/firestore'
import UserItem from '../components/UserItem'
import { useTheme } from '../provider/ThemeProvider'
import { IoArrowBackOutline } from 'react-icons/io5'
import { AiOutlineMore } from 'react-icons/ai'
import "../styles/metrics.css"

const PostActivity = () => {
    const {postId} = useParams()
    const [theme] = useTheme()
    const nav = useNavigate()
    const [likedUsers, setLikedUsers] = useState([])

    const {data: likedUserIds, isLoading} = useQuery({
        queryKey: ['likedUsers', postId],
        queryFn: async () => await getLikedUsers(postId)
    })

    useEffect(() => {
        if (isLoading || !likedUserIds) return;
    
        const fetchUsers = async () => {
            const users = await Promise.all(likedUserIds?.map(id => getUser(id)));
            setLikedUsers(users);
        };
    
        fetchUsers();
    }, [likedUserIds, isLoading]);

    if(isLoading) return "Loading..."
  return (
    <div className={`post-activity primary-${theme}-bg midtone-${theme}`}>
        <div className="activity">
            <div className="header">
                <div className={`back ${theme}-hover`} onClick={() => nav(-1)}>
                    <IoArrowBackOutline />
                </div>
                <p>Activity</p>
                <div className={`meatball ${theme}-hover`}>
                    <AiOutlineMore />
                </div>
            </div>
            {likedUsers?.map((likedUser, idx) => <UserItem key={idx} userData={likedUser} className='liked'/>)}
        </div>
    </div>
  )
}

export default PostActivity