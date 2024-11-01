import React, { useEffect, useRef, useState } from 'react'
import {  addComment, decrementLikes, getComments, getUser, incrementLikes, isUserAlreadyLiked } from '../utils/firestore'
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { IoMdHeart, IoMdHeartEmpty, IoMdRepeat } from "react-icons/io";
import { IoChatbubbleOutline } from "react-icons/io5";
import { BsSend } from "react-icons/bs";
import debounce from 'lodash.debounce';
import { timeAgo, formatNumber } from '../utils/helper';
import '../styles/post.css'
import AddComment from './AddComment';


const Comment = ({comment, currentUser, parentsId, parentReplyRef, lastRef, theme}) => {
    const [liked, setLiked] = useState(false)
    const [localLikesCount, setLocalLikesCount] = useState(comment.likesCount)
    const [isMutating, setIsMutating] = useState(false)
    const [isCommenting, setIsCommenting] = useState(false)
    const [commentContent, setCommentContent] = useState({ context: '', attachments: []})
    const queryClient = useQueryClient()
    const replyRef = useRef()
    const commentRef = useRef()
    const lastReplyRef = useRef()

    const {data: postOwner, isLoading: isUserLoading} = useQuery({
        queryKey: ['user', comment.userId],
        queryFn: async () => await getUser(comment.userId)
    })

    const { data: hasLiked } = useQuery({
        queryKey: ["likes", comment.id, currentUser?.uid],
        queryFn: async () => await isUserAlreadyLiked(comment.id, currentUser.uid, parentsId),
        enabled: !!currentUser
      })

    const { mutate: toggleLike, isPending } = useMutation({
        mutationFn: async () => {
            console.log(hasLiked)
          if (!hasLiked) {
            await incrementLikes(comment.id, 'likesCount', currentUser.uid, parentsId)
          } else {
            await decrementLikes(comment.id, 'likesCount', currentUser.uid, parentsId)
          }
        },
        onMutate: async () => {
            setIsMutating(true)
            await queryClient.cancelQueries({ queryKey: ["likes", comment.id] })
        
            const previousLikes = queryClient.getQueryData(["likes", comment.id])
        
            setLocalLikesCount((prev) => (hasLiked ? prev - 1 : prev + 1))
            setLiked(!hasLiked)
        
            return { previousLikes }
        },
        onError: (err, newLike, context) => {
            setLocalLikesCount(context.previousLikes)
            setLiked(hasLiked)
        },
        onSettled: () => {
          queryClient.invalidateQueries({ queryKey: ["likes", comment.id] })
          queryClient.invalidateQueries({ queryKey: ["likes", comment.id, currentUser?.uid] })
          setIsMutating(false);
        },
    });

    const {
        data: replies,
        fetchNextPage, 
        hasNextPage, 
        isFetchingNextPage,
        isLoading: isRepliesLoading
    } = useInfiniteQuery({
        queryKey: ['replies', comment.id, currentUser?.uid],
        queryFn: async (param) => {
            if (currentUser?.uid && comment.id) {
                return await getComments(param, currentUser.uid, comment.id, parentsId)
            }
        },
        initialPageParam: null,
        getNextPageParam: last => last.lastDoc,
        enabled: !!currentUser && !!comment
    })

    const connectReplies = () => {
        if(lastReplyRef.current) 
            commentRef?.current.style.setProperty('--height', `calc(${getComputedStyle(commentRef?.current).height} - ${getComputedStyle(lastReplyRef?.current).height} - 3.6rem)`)
    }

    const {isPending: isReplying, mutate: mutateReply} = useMutation({
        mutationFn: async () => await addComment(currentUser.uid, comment.id, commentContent, parentsId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["replies", comment.id, currentUser.uid]})
            setCommentContent(prev => ({...prev, context: ""}))
            connectReplies()
        }
    })

    const handleLike = debounce(() => {
        if (!isUserLoading && currentUser) {
            toggleLike();
        }
    }, 500)

    const submitReply = () => {
        mutateReply()
    }

    const setCommentRefs = (el) => {
        commentRef.current = el;

        if (lastRef) {
            lastRef.current = el;
        }
    }

    useEffect(() => {
        if(hasLiked) {
            setLiked(true)
        } else {
            setLiked(false)
        }

        connectReplies()

    },[hasLiked, lastReplyRef, isCommenting, isReplying])
    
  return (
    <div className={`post ${parentsId.length > 1 ? 'comment' : ''} ${replies?.pages[0].comments.length > 0 && isCommenting? 'hasReplies' : ''} mono-${theme}-border`} ref={setCommentRefs}>    
        <div className={`before mono-${theme}-border`}></div>
        <div className={`after mono-${theme}-bg`}></div>
        <div className="post-details">
            <div className={`display-picture mono-${theme}-bg`}>
                {postOwner?.photoURL && <img src={postOwner.photoURL} />}
            </div>
            <div className="content">
                <div className="post-header">
                    <div className="name">{postOwner?.displayName}</div>
                    <div className="username">@{postOwner?.username}</div>
                    <div className="post-time">{timeAgo(comment.createdAt)}</div>
                </div>
                <div className="context">
                    {comment.content.split("\n").map((line, i) => (
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
                    <div className="data comments" onClick={() => parentsId.length < 3 ? setIsCommenting(!isCommenting) : parentReplyRef.current.focus() }>
                        <IoChatbubbleOutline />
                        <div className="count">
                            {!!comment.commentsCount && comment.commentsCount}
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
                {
                    isCommenting && 
                    <AddComment 
                        commentContent={commentContent}
                        setCommentContent={setCommentContent}
                        submitComment={submitReply}
                        placeholder={`Reply to @${postOwner?.username}`}
                        replyRef={replyRef}
                        isCommenting={isReplying}
                    />
                }
                {
                    replies?.pages[0].comments.length > 0 &&
                    replies.pages.map((chunk, i) => (
                        <div key={i} className={`comment`}>
                            {chunk.comments.map((com, i) => isCommenting && 
                                <Comment 
                                    lastRef={chunk.comments.length - 1 == i && lastReplyRef} 
                                    comment={com} key={com.id} 
                                    currentUser={currentUser} 
                                    parentsId={parentsId.length < 3 ? [...parentsId, comment.id] : [...parentsId]} 
                                    parentReplyRef={replyRef} 
                                    theme={theme}
                                />
                            )}
                        </div>
                    ))
                }
            </div>
        </div>
    </div>
  )
}

export default Comment