import React, { useEffect, useRef, useState } from 'react'
import {  decrementLikes, getUser, incrementLikes, isUserAlreadyLiked } from '../utils/firestore'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { IoMdHeart, IoMdHeartEmpty, IoMdRepeat } from "react-icons/io";
import { IoChatbubbleOutline, IoPause, IoPlay, IoVolumeHigh, IoVolumeMute } from "react-icons/io5";
import { BsSend } from "react-icons/bs";
import debounce from 'lodash.debounce';
import { useNavigate } from 'react-router';
import { timeAgo, formatNumber, getFileType } from '../utils/helper';
import '../styles/post.css'
import { useTheme } from '../provider/ThemeProvider';


const Post = ({post, currentUser}) => {
    const [liked, setLiked] = useState(false)
    const [vidmMuted, setVidMuted] = useState(true)
    const [vidPaused, setVidPaused] = useState(false)
    const [localLikesCount, setLocalLikesCount] = useState(post.likesCount)
    const [isMutating, setIsMutating] = useState(false)
    const [theme, setTheme] = useTheme()
    const queryClient = useQueryClient()
    const navigate = useNavigate()
    const vidRef = useRef()
    const playIconRef = useRef()

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
    }, 1000)

    const handlePostClicked = e => {
        navigate(`/${postOwner.username}/post/${post.id}`)
    }

    const toggleMute = e => {
        e.stopPropagation()

        setVidMuted(prev => !prev)
    }

    const togglePaused = () => {
        
        if(vidPaused) {
            vidRef.current.play()
            playIconRef.current.classList.remove('paused')
            playIconRef.current.classList.add('play')
        } else {
            vidRef.current.pause()
            playIconRef.current.classList.remove('play')
            playIconRef.current.classList.add('paused')
        }
        setVidPaused(!vidPaused)

        setTimeout(() => {
            playIconRef.current.classList.remove('play')
            playIconRef.current.classList.remove('paused')
        }, 600)
    }

    useEffect(() => {
        if(hasLiked) {
            setLiked(true)
        } else {
            setLiked(false)
        }
    },[hasLiked])
    
  return (
    <div className={`post mono-${theme}-border`}>
        <div className="post-details">
            <div className={`display-picture mono-${theme}-bg`}></div>
            <div className="content">
                <div className="post-header">
                    <div className="name">{postOwner?.displayName}</div>
                    <div className="username">@{postOwner?.username}</div>
                    <div className={`post-time mono-${theme}`} onClick={handlePostClicked}>{timeAgo(post.createdAt)}</div>
                </div>
                <div className="context">
                    <div className="texts">
                        {post.content.split("\n").map((line, i) => (
                            <div className="text" key={i}>{line} <br/></div>
                        ))}
                    </div>
                    {post.attachments.length > 0 &&
                        <div className="medias">
                            {post.attachments.map((link, i) => {

                                const fileType = getFileType(link)
                                
                                return (
                                    <div className="media" key={i}>
                                        {fileType === "Image" ?
                                            <img src={link} alt="Attachment Preview" className="attachment-preview" /> :
                                            <div className="video" onClick={() => togglePaused()}>
                                                <video muted={vidmMuted} loop autoPlay ref={vidRef}>
                                                    <source src={link} type="video/mp4" />
                                                </video>
                                                <div className={`toggle-mute`} onClick={toggleMute}>{vidmMuted ? <IoVolumeMute /> : <IoVolumeHigh />}</div>
                                                <div className={`toggle-pause`} ref={playIconRef}>{!vidPaused ? <IoPlay /> : <IoPause />}</div>
                                            </div>
                                        }
                                    </div>
                                )
                            })}
                        </div>
                    }
                </div>
                <div className="post-datas">
                    <div className={`data likes ${liked && 'liked'} ${theme}-hover`} onClick={() => !isMutating && handleLike()} style={{ pointerEvents: isMutating ? 'none' : 'auto' }}>
                        {liked ? <IoMdHeart /> : <IoMdHeartEmpty />}
                        <div className="count">
                            {!!localLikesCount && formatNumber(localLikesCount)}
                        </div>
                    </div>
                    <div className={`data comments ${theme}-hover`} onClick={handlePostClicked}>
                        <IoChatbubbleOutline />
                        <div className="count">
                            {!!post.commentsCount && post.commentsCount}
                        </div>
                    </div>
                    <div className={`data repost ${theme}-hover`}>
                        <IoMdRepeat />
                        <div className="count">
                        </div>
                    </div>
                    <div className={`data share ${theme}-hover`}>
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