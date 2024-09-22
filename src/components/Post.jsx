import React from 'react'
import { getUser } from '../utils/firestore'
import { useQuery } from '@tanstack/react-query'

function timeAgo(postedTime) {
    const now = new Date();
    const postedDate = postedTime.toDate();
    
    const seconds = Math.floor((now - postedDate) / 1000);
    
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (seconds < 60) {
      return seconds < 5 ? 'a moment ago' : `a few seconds ago`;
    } else if (minutes < 60) {
      return minutes === 1 ? '1 minute ago' : `${minutes} minutes ago`;
    } else if (hours < 24) {
      return hours === 1 ? '1 hour ago' : `${hours} hours ago`;
    } else {
      return days === 1 ? '1 day ago' : `${days} days ago`;
    }
}

const Post = ({post}) => {
    const today = new Date()

    const {data: currentUser, isLoading} = useQuery({
        queryKey: ['user', post.userId],
        queryFn: async () => await getUser(post.userId),
    })

    
  return (
    <div key={post.id} className='post'>
        <div className="post-details">
            <div className="display-picture"></div>
            <div className="content">
                <div className="post-header">
                    <div className="name">{currentUser?.displayName}</div>
                    <div className="username">@{currentUser?.username}</div>
                    <div className="post-time">{timeAgo(post.createdAt)}</div>
                </div>
                <div className="context">
                    <div className="text">{post.content}</div>
                </div>
            </div>
        </div>
        <div className="post-datas"></div>
    </div>
  )
}

export default Post