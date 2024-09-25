import React, { useEffect, useState } from 'react'
import {  decrementLikes, getUser, incrementLikes, isUserAlreadyLiked } from '../utils/firestore'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { IoMdHeart, IoMdHeartEmpty, IoMdRepeat } from "react-icons/io";
import { IoChatbubbleOutline } from "react-icons/io5";
import { BsSend } from "react-icons/bs";
import debounce from 'lodash.debounce';
import { useNavigate } from 'react-router';
import { timeAgo, formatNumber } from '../utils/helper';
import '../styles/post.css'


const Post = ({post, currentUser}) => {
    const [liked, setLiked] = useState(false)
    const [localLikesCount, setLocalLikesCount] = useState(post.likesCount)
    const [isMutating, setIsMutating] = useState(false)
    const queryClient = useQueryClient()
    const navigate = useNavigate()

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
          if (!hasLiked) {
            await incrementLikes(post.id, 'likesCount', currentUser.uid)
          } else {
            await decrementLikes(post.id, 'likesCount', currentUser.uid)
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

    const handlePostClicked = e => {
        navigate(`/${postOwner.username}/post/${post.id}`)
    }

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
                    <div className="post-time" onClick={handlePostClicked}>{timeAgo(post.createdAt)}</div>
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
                    <div className="data comments" onClick={handlePostClicked}>
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