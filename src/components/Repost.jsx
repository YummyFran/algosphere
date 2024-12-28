import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { getPost, getUser } from '../utils/firestore'
import { timeAgo } from '../utils/helper'
import { useNavigate } from 'react-router'
import { useTheme } from '../provider/ThemeProvider'
import PostAttachments from './PostAttachments'
import dp from '../assets/defaultDP.jpg'
import Loading from './Loading'

const Repost = ({postReference, vidmMuted, vidRef, toggleMute, togglePaused, playIconRef, vidPaused}) => {
    const navigate = useNavigate()
    const [theme] = useTheme()
    
    const {data: originalPost, isLoading: isOriginalPostLoading} = useQuery({
        queryKey: ['originalPost', postReference],
        queryFn: async () => await getPost(postReference)
    })

    const {data: postOwner, isLoading: isUserLoading} = useQuery({
        queryKey: ['user', originalPost?.userId],
        queryFn: async () => await getUser(originalPost?.userId)
    })

    const handlePostClicked = e => {
        navigate(`/${postOwner?.username}/post/${postReference}`)
    }

    const handleProfileClicked = () => {
        navigate(`/${postOwner?.username}`)
    }

    if(isOriginalPostLoading || isUserLoading) return <Loading />
  return (
    <div className={`repost mono-${theme}-border`}>
        <div className="post-header">
            <div className={`repost-display-picture mono-${theme}-bg`} onClick={handleProfileClicked}>
                <img src={postOwner?.photoURL ? postOwner.photoURL : dp} alt={postOwner?.displayName}/>
            </div>
            <div className="name" onClick={handleProfileClicked}>{postOwner?.displayName}</div>
            <div className="username" onClick={handleProfileClicked}>@{postOwner?.username}</div>
            <div className={`post-time mono-${theme}`} onClick={handlePostClicked}>{timeAgo(originalPost?.createdAt)}</div>
        </div>
        <div className="context">
            <div className="texts">
                {originalPost?.content?.split("\n").map((line, i) => (
                    <div className="text" key={i}>{line} <br/></div>
                ))}
            </div>
            {originalPost?.attachments?.length > 0 &&
                <PostAttachments post={originalPost}  vidmMuted={vidmMuted} vidRef={vidRef} toggleMute={toggleMute} togglePaused={togglePaused} playIconRef={playIconRef} vidPaused={vidPaused}/>
            }
        </div>
    </div>
  )
}

export default Repost