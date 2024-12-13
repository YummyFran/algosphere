import React, { useEffect, useRef, useState } from 'react'
import {  addQuotedRepost, addRepost, checkIfFollowing, decrementLikes, deletePost, followUser, getUser, incrementLikes, isPostMetricsHidden, isPostPinned, isPostSaved, isUserAlreadyLiked, pinPost, savePost, toggleMetrics, unFollowUser, updatePost } from '../utils/firestore'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { IoIosLink, IoMdHeart, IoMdHeartEmpty, IoMdRepeat } from "react-icons/io";
import { IoBookmark, IoBookmarkOutline, IoChatbubbleOutline, IoEyeOffOutline, IoHeartDislike, IoHeartDislikeOutline, IoPause, IoPlay, IoVolumeHigh, IoVolumeMute } from "react-icons/io5";
import { TiPin, TiPinOutline } from "react-icons/ti";
import { LiaUserClockSolid, LiaUserMinusSolid, LiaUserPlusSolid } from "react-icons/lia";
import { TbMessageReport } from "react-icons/tb";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { BsSend } from "react-icons/bs";
import { LuQuote } from "react-icons/lu";
import debounce from 'lodash.debounce';
import { useNavigate } from 'react-router';
import { timeAgo, formatNumber } from '../utils/helper';
import '../styles/post.css'
import { useTheme } from '../provider/ThemeProvider';
import { GoTrash } from 'react-icons/go';
import { useToast } from '../provider/ToastProvider';
import dp from '../assets/defaultDP.jpg'
import { useUser } from '../provider/UserProvider';
import PostAttachments from './PostAttachments';
import Repost from './Repost';
import RepostModal from './RepostModal';
import Modal from './Modal';


const Post = ({post, currentUser, isPinned}) => {
    const [liked, setLiked] = useState(false)
    const [vidmMuted, setVidMuted] = useState(true)
    const [vidPaused, setVidPaused] = useState(false)
    const [localLikesCount, setLocalLikesCount] = useState(0)
    const [isMutating, setIsMutating] = useState(false)
    const [repostContext, setRepostContext] = useState("")
    const [isRepostModalOpen, setIsRepostModalOpen] = useState(false)
    const [iseEditModalOpen, setIsEditModalOpen] = useState(false)
    const [postContext, setPostContext] = useState('')
    const [theme] = useTheme()
    const [addToast] = useToast()
    const [user] = useUser()
    const queryClient = useQueryClient()
    const navigate = useNavigate()
    const vidRef = useRef()
    const playIconRef = useRef()
    const menuRef = useRef()
    const meatballRef = useRef()
    const repostOptionsRef = useRef()
    const textAreaRef = useRef()

    const {data: postOwner, isLoading: isUserLoading} = useQuery({
        queryKey: ['user', post.userId],
        queryFn: async () => await getUser(post.userId)
    })

    const { data: hasLiked } = useQuery({
        queryKey: ["likes", post.id, currentUser?.uid],
        queryFn: async () => await isUserAlreadyLiked(post.id, currentUser.uid),
        enabled: !!currentUser
    })

    const { data: isThisPostSaved } = useQuery({
        queryKey: ["isPostSaved", post.id, user.uid],
        queryFn: async () => await isPostSaved(post.id, user.uid)
    })

    const { data: isThisPostPinned } = useQuery({
        queryKey: ["isPostPinned", post.id, user.uid],
        queryFn: async () => await isPostPinned(post.id, user.uid)
    })

    const { data: isThisPostMetricsHidden } = useQuery({
        queryKey: ["isPostMetricsHidden", post.id],
        queryFn: async () => await isPostMetricsHidden(post.id)
    })

    const { data: isFollowing } = useQuery({
        queryKey: ["isFollowing", currentUser.uid, post.userId],
        queryFn: async () => await checkIfFollowing(currentUser.uid, post.userId)
    })

    const { mutate: toggleLike } = useMutation({
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

    const {mutate: mutateDelete} = useMutation({
        mutationFn: async () => await deletePost(post.id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["posts"]})
            addToast("Post Deleted", "Your post was successfully removed", "error")
        }
    })

    const { mutate: mutateRepost} = useMutation({
        mutationFn: async (id) => await addRepost(user, id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["posts"]})
            addToast("Reposted", `You reposted ${postOwner.username}'s post`, "success")
        }
    })

    const { mutate: mutateQuotedRepost} = useMutation({
        mutationFn: async ([id, content]) => await addQuotedRepost(user, id, content),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["posts"]})
            closeModal()
            addToast("Reposted", `You reposted ${postOwner.username}'s post`, "success")
        }
    })

    const { mutate: mutatePost} = useMutation({
        mutationFn: async (content) => await updatePost(post.id, {
            content: postContext
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["posts"]})
            closeEditModal()
            closeMenu()
            addToast("Post Updated", "Your post was successfully updated", "success")
        }
    })

    const { mutate: mutateSavePost} = useMutation({
        mutationFn: async () => await savePost(post.id, user.uid),
        onSuccess: (postUnsaved) => {
            queryClient.invalidateQueries({ queryKey: ["isPostSaved", post.id, user.uid]})
            closeMenu()
            addToast(`Post ${postUnsaved ? 'Unsaved' : 'Saved'}`, `You ${postUnsaved ? 'unsaved' : 'saved'} this post`, `${postUnsaved ? 'error' : 'success'}`)
        }
    })

    const { mutate: mutatePinPost} = useMutation({
        mutationFn: async () => await pinPost(post.id, user.uid),
        onSuccess: (postUnpinned) => {
            queryClient.invalidateQueries({ queryKey: ["isPostPinned", post.id, user.uid]})
            queryClient.invalidateQueries({ queryKey: ['userposts', user?.uid]})
            closeMenu()
            addToast(`Post ${postUnpinned ? 'Unpinned' : 'Pinned'}`, `You ${postUnpinned ? 'unpinned' : 'pinned'} this post`, `${postUnpinned ? 'error' : 'success'}`)
        }
    })

    const { mutate: mutataToggleMetrics} = useMutation({
        mutationFn: async () => await toggleMetrics(post.id),
        onSuccess: (metricsHidden) => {
            queryClient.invalidateQueries({ queryKey: ["isPostMetricsHidden", post.id]})
            queryClient.invalidateQueries({ queryKey: ["userposts", user.uid]})
            queryClient.invalidateQueries({ queryKey: ["posts"]})
            closeMenu()
            addToast(`Post Metrics ${metricsHidden ? 'Visible' : 'Hidden'}`, `You ${metricsHidden ? 'unhide' : 'hid'} this post's metrics`)
        }
    })

    const { mutate: mutateFollow } = useMutation({
        mutationFn: async () => await followUser(currentUser?.uid, post.userId),
        onSuccess: () => {
            queryClient.invalidateQueries(["isFollowing", currentUser.uid, post.userId])
            closeMenu()
            addToast("Followed", `You are now following ${postOwner?.username}`, "success")
        }
    })

    const { mutate: mutateUnFollow } = useMutation({
        mutationFn: async () => await unFollowUser(currentUser?.uid, post.userId),
        onSuccess: () => {
            queryClient.invalidateQueries(["isFollowing", currentUser.uid, post.userId])
            closeMenu()
            addToast("Unfollowed", `You unfollowed ${postOwner?.username}`, "info")
        }
    })

    const handleLike = debounce(() => {
        if (!isUserLoading && currentUser) {
            toggleLike();
        }
    }, 500)

    const handleRepost = (context) => {
        const id = post.isRepost ? post.repostOf : post.id
        closeMenu()

        console.log("reposting", context)
        if(context) {
            console.log("with context")
            mutateQuotedRepost([id, context])
        } else {
            console.log("no context")
            mutateRepost(id)
        }
    }

    const handleQuotedRepost = () => {
        setIsRepostModalOpen(true)
    }

    const handlePostClicked = e => {
        navigate(`/${postOwner.username}/post/${post.id}`)
    }

    const handleProfileClicked = () => {
        navigate(`/${postOwner.username}`)
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

    const handleEditChange = e => {
        setPostContext(e.target.value)
    }

    const handleEdit = () => {
        setIsEditModalOpen(true)
    }

    const closeEditModal = () => {
        setIsEditModalOpen(false)
    }

    const handleSave = () => {
        mutatePost()
    }

    const handleSavePost = () => {
        mutateSavePost()
    }

    const handlePinPost = () => {
        mutatePinPost()
    }

    const handleToggleMetrics = () => {
        mutataToggleMetrics()
    }

    const showMenu = e => {
        e.stopPropagation()
        menuRef.current.classList.toggle("show")
    }

    const closeMenu = () => {
        menuRef.current.classList.remove('show')
        repostOptionsRef.current.classList.remove("show")
    }

    const closeModal = () => {
        setIsRepostModalOpen(false)
    }

    const showRepostOptions = e => {
        e.stopPropagation()
        repostOptionsRef.current.classList.toggle("show")
    }
    
    const copyLink = () => {
        navigator.clipboard.writeText(`${window.location.origin}/${postOwner.username}/post/${post.id}`)
        addToast("Success", "Linked Copied", "success")
    }

    const setTextAreaRef = (node) => {
        if (node) {
            textAreaRef.current = node;
            handleExpand(node);
        }
    }

    const handleExpand = e => {
        e.style.height = 'auto'
        e.style.height =  e.value ? `${e.scrollHeight}px` : '2rem'
    }

    useEffect(() => {
        if(!textAreaRef.current) return

        requestAnimationFrame(() => {
            handleExpand(textAreaRef.current);
        })
    }, [postContext, textAreaRef.current])

    useEffect(() => {
        window.addEventListener('click', closeMenu)
  
        return () => {
            window.removeEventListener('click', closeMenu)
        }
    }, [])

    useEffect(() => {
        setPostContext(post.content)

        if(!textAreaRef.current) return

        textAreaRef.current?.focus()

        const length = textAreaRef.current?.value.length;

        textAreaRef.current.selectionStart = length;
        textAreaRef.current.selectionEnd = length;
    }, [iseEditModalOpen, textAreaRef.current])

    useEffect(() => {
        if(!post) return
        setLocalLikesCount(post.likesCount)
    }, [post])

    useEffect(() => {
        if(hasLiked) {
            setLiked(true)
        } else {
            setLiked(false)
        }
    },[hasLiked])
    
  return (
    <div className={`post mono-${theme}-border`}>
        <RepostModal 
            isOpen={isRepostModalOpen} 
            close={closeModal}
            handleRepost={handleRepost}
            currentUser={currentUser} 
            post={post} repostContext={repostContext} 
            setRepostContext={setRepostContext}
            vidmMuted={vidmMuted} 
            vidRef={vidRef} 
            toggleMute={toggleMute} 
            togglePaused={togglePaused} 
            playIconRef={playIconRef} 
            vidPaused={vidPaused}
        />
        <Modal
            isOpen={iseEditModalOpen}
            onClose={closeEditModal}
            className={`edit-post-modal primary-${theme}-bg`}
            title={`Edit Post`}
            submitValue={'Edit'}
            handleSubmit={handleSave}
            submitDisabled={postContext === post.content || postContext.trim() === ""}
        >
            <div className="display-picture">
                <img src={postOwner?.photoURL ? postOwner.photoURL : dp} alt={postOwner?.displayName}/>
            </div>
            <div className="details">
                <div className="post-header">
                    <div className="name">{postOwner?.displayName}</div>
                    <div className="username">@{postOwner?.username}</div>
                </div>
                <textarea name="context" className="context" ref={setTextAreaRef} value={postContext} onChange={handleEditChange}></textarea>
            </div>
        </Modal>
        {post.isRepost && <div className={`repost-indicator mono-${theme}`}>
            <IoMdRepeat />
            <span>
                {`${postOwner?.username === currentUser?.username ? 'You' : '@' + postOwner?.username} reposted`}
            </span>
        </div>}
        {isPinned && <div className={`repost-indicator mono-${theme}`}>
            <TiPin />
            <span>
                {`${postOwner?.username === currentUser?.username ? 'Your' : '@' + postOwner?.username + "'s"} pinned post`}
            </span>
        </div>}
        <div className="post-details">
            <div className={`display-picture mono-${theme}-bg`} onClick={handleProfileClicked}>
                <img src={postOwner?.photoURL ? postOwner.photoURL : dp} alt={postOwner?.displayName}/>
            </div>
            <div className={`menu ${theme}-shadow primary-${theme}-bg`} ref={menuRef} onClick={e => e.stopPropagation()}>
            {
                postOwner?.uid === currentUser?.uid ?
                <>
                    <div className="temporary">
                        <div className="edit" onClick={() => handleEdit()}>
                            <span>Edit</span>
                            <div className="timer"></div>
                        </div>
                    </div>
                    <div className="accessibility">
                        <div className="save" onClick={() => handleSavePost()}>
                            <span>{isThisPostSaved ? 'Unsave' : 'Save'}</span>
                            {isThisPostSaved ? <IoBookmark /> : <IoBookmarkOutline />}
                        </div>
                        <div className="pin-to-profile" onClick={() => handlePinPost()}>
                            <span>{isThisPostPinned ? 'Unpin' : 'Pin to profile'}</span>
                            {isThisPostPinned ? <TiPin /> : <TiPinOutline />}
                        </div>
                        <div className="hide-metrics" onClick={() => handleToggleMetrics()}>
                            <span>{isThisPostMetricsHidden ? 'Show like and share counts' : 'Hide like and share counts'}</span>
                            {isThisPostMetricsHidden ? <IoHeartDislike /> : <IoHeartDislikeOutline />}
                        </div>
                    </div>
                    <div className="danger">
                        <div className="delete" onClick={() => mutateDelete()}>
                            <span>Delete</span>
                            <GoTrash />
                        </div>
                    </div>
                </>:
                <>
                    <div className="necessity">
                        <div className="save" onClick={() => handleSavePost()}>
                            <span>{isThisPostSaved ? 'Unsave' : 'Save'}</span>
                            {isThisPostSaved ? <IoBookmark /> : <IoBookmarkOutline />}
                        </div>
                        {/* <div className="not-interested">
                            <span>Not interested</span>
                            <IoEyeOffOutline />
                        </div> */}
                    </div>
                    <div className="accesibility">
                        {/* <div className="mute">
                            <span>Mute</span>
                            <LiaUserClockSolid />
                        </div> */}
                        <div className="unfollow" onClick={() => isFollowing ? mutateUnFollow() : mutateFollow()}>
                            <span>{isFollowing ? "Unfollow" : "Follow"}</span>
                            {isFollowing ? <LiaUserMinusSolid /> : <LiaUserPlusSolid /> }
                        </div>
                        <div className="report">
                            <span>Report</span>
                            <TbMessageReport />
                        </div>
                    </div>
                    
                </>
            }
                <div className="necessary">
                    <div className="copy-link" onClick={() => copyLink()}>
                        <span>Copy link</span>
                        <IoIosLink />
                    </div>
                </div>
            </div>
            <div className={`repost-options ${theme}-shadow primary-${theme}-bg`} ref={repostOptionsRef} onClick={e => e.stopPropagation()}>
                <div className="option" onClick={() => handleRepost()}>
                    <div className="text">Repost</div>
                    <IoMdRepeat />
                </div>
                <div className="option" onClick={handleQuotedRepost}>
                    <div className="text">Quote</div>
                    <LuQuote />
                </div>
            </div>
            <div className="content">
                <div className="post-header">
                    <div className="name" onClick={handleProfileClicked}>{postOwner?.displayName}</div>
                    <div className="username" onClick={handleProfileClicked}>@{postOwner?.username}</div>
                    <div className={`post-time mono-${theme}`} onClick={handlePostClicked}>{timeAgo(post.createdAt)}</div>
                    <div className={`meatball ${theme}-hover`} onClick={showMenu} ref={meatballRef}>
                        <HiOutlineDotsHorizontal />
                    </div>
                </div>
                <div className="context">
                    <div className="texts">
                        {post?.content?.split("\n").map((line, i) => (
                            <div className="text" key={i}>{line} <br/></div>
                        ))}
                    </div>
                    {post.isRepost ? 
                        <Repost 
                            postReference={post.repostOf} 
                            vidmMuted={vidmMuted} 
                            vidRef={vidRef} 
                            toggleMute={toggleMute} 
                            togglePaused={togglePaused} 
                            playIconRef={playIconRef} 
                            vidPaused={vidPaused}
                        /> :
                        
                        post?.attachments?.length > 0 &&
                        <PostAttachments post={post}  vidmMuted={vidmMuted} vidRef={vidRef} toggleMute={toggleMute} togglePaused={togglePaused} playIconRef={playIconRef} vidPaused={vidPaused}/>
                    }
                </div>
                <div className="post-datas">
                    <div className={`data likes ${liked && 'liked'} ${theme}-hover`} onClick={() => !isMutating && handleLike()} style={{ pointerEvents: isMutating ? 'none' : 'auto' }}>
                        {liked ? <IoMdHeart /> : <IoMdHeartEmpty />}
                        <div className="count">
                            {!!localLikesCount && !post.isMetricsHidden && formatNumber(localLikesCount)}
                        </div>
                    </div>
                    <div className={`data comments ${theme}-hover`} onClick={handlePostClicked}>
                        <IoChatbubbleOutline />
                        <div className="count">
                            {!!post.commentsCount && post.commentsCount}
                        </div>
                    </div>
                    <div className={`data repost ${theme}-hover`} onClick={showRepostOptions}>
                        <IoMdRepeat />
                        <div className="count">
                            {!!post.repostCount && !post.isMetricsHidden && post.repostCount}
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