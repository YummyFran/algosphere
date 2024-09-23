import React, { useEffect, useState } from 'react'
import { decrementData, getCountData, getUser, incrementData, isUserAlreadyLiked } from '../utils/firestore'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { IoMdHeart, IoMdHeartEmpty, IoMdRepeat } from "react-icons/io";
import { IoChatbubbleOutline } from "react-icons/io5";
import { BsSend } from "react-icons/bs";
import debounce from 'lodash.debounce';

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
    } else if(days < 7) {
      return days === 1 ? '1 day ago' : `${days} days ago`;
    } else {
        return postedDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }
}

function formatNumber(num) {
    if (num >= 1_000_000_000) {
        return (Math.floor(num / 100_000_000) / 10) + 'B';
    } else if (num >= 1_000_000) {
        const formatted = Math.floor(num / 100_000) / 10;
        return formatted % 1 === 0 ? formatted.toFixed(0) + 'M' : formatted + 'M'; 
    } else if (num >= 1_000) {
        const formatted = Math.floor(num / 100) / 10;
        return formatted % 1 === 0 ? formatted.toFixed(0) + 'K' : formatted + 'K'; 
    } else {
        return num.toString();
    }
}

const Post = ({post, currentUser}) => {
    const [liked, setLiked] = useState(false)
    const [localLikesCount, setLocalLikesCount] = useState(post.likesCount)
    const [isMutating, setIsMutating] = useState(false)
    const queryClient = useQueryClient()

    const {data: postOwner, isLoading: isUserLoading} = useQuery({
        queryKey: ['user', post.userId],
        queryFn: async () => await getUser(post.userId)
    })

    const { data: hasLiked } = useQuery({
        queryKey: ["likes", post.id, currentUser?.uid],
        queryFn: async () => await isUserAlreadyLiked(post.id, currentUser.uid),
        enabled: !!currentUser
      })

    const { mutate: toggleLike, isPending } = useMutation({
        mutationFn: async () => {
            console.log(hasLiked)
          if (!hasLiked) {
            await incrementData(post.id, 'likesCount', currentUser.uid)
          } else {
            await decrementData(post.id, 'likesCount', currentUser.uid)
          }
        },
        onMutate: async () => {
            setIsMutating(true)
            await queryClient.cancelQueries({ queryKey: ["likes", post.id] })
        
            const previousLikes = queryClient.getQueryData(["likes", post.id])
        
            setLocalLikesCount((prev) => (hasLiked ? prev - 1 : prev + 1))
            setLiked(!hasLiked)
        
            return { previousLikes }
        },
        onError: (err, newLike, context) => {
            setLocalLikesCount(context.previousLikes)
            setLiked(hasLiked)
        },
        onSettled: () => {
          queryClient.invalidateQueries({ queryKey: ["likes", post.id] })
          queryClient.invalidateQueries({ queryKey: ["likes", post.id, currentUser?.uid] })
          setIsMutating(false);
        },
    });

    const handleLike = debounce(() => {
        if (!isUserLoading && currentUser) {
            toggleLike();
        }
    }, 500)

    useEffect(() => {
        if(hasLiked) {
            setLiked(true)
        } else {
            setLiked(false)
        }
    },[hasLiked])
    
  return (
    <div key={post.id} className='post'>
        <div className="post-details">
            <div className="display-picture"></div>
            <div className="content">
                <div className="post-header">
                    <div className="name">{postOwner?.displayName}</div>
                    <div className="username">@{postOwner?.username}</div>
                    <div className="post-time">{timeAgo(post.createdAt)}</div>
                </div>
                <div className="context">
                    {post.content.split("\n").map((line, i) => (
                        <div className="text" key={i}>{line} <br/></div>
                    ))}

                </div>
                <div className="post-datas">
                    <div className={`data likes ${liked && 'liked'}`} onClick={() => !isMutating && handleLike()} style={{ pointerEvents: isMutating ? 'none' : 'auto' }}>
                        {liked ? <IoMdHeart /> : <IoMdHeartEmpty />}
                        <div className="count">
                            {!!localLikesCount && formatNumber(localLikesCount)}
                        </div>
                    </div>
                    <div className="data comments">
                        <IoChatbubbleOutline />
                        <div className="count">
                            {!!post.commentsCount && post.commentsCount}
                        </div>
                    </div>
                    <div className="data repost">
                        <IoMdRepeat />
                        <div className="count">
                        </div>
                    </div>
                    <div className="data share">
                        <BsSend />
                        <div className="count">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Post