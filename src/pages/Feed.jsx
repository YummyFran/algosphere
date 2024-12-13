import React, { useEffect, useRef, useState } from 'react'
import { useUser } from '../provider/UserProvider'
import { Navigate } from 'react-router'
import { addPost, getPosts, getUser, updatePost } from '../utils/firestore'
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import '../styles/home.css'
import Post from '../components/Post'
import CreatePost from '../components/CreatePost'
import { useTheme } from '../provider/ThemeProvider'
import { uploadPostMedias } from '../utils/bucket'
import { arrayUnion } from 'firebase/firestore'
import { useToast } from '../provider/ToastProvider'

const Feed = () => {
    const [postContent, setPostContent] = useState({context: '', attachments: [], attachmentPreviews: []})
    const [progress, setProgress] = useState([])
    const [user] = useUser()
    const [theme] = useTheme()
    const [addToast] = useToast()
    const textAreaRef = useRef()
    const queryClient = useQueryClient()

    const {data: currentUser, isLoading} = useQuery({
        queryKey: ['user'],
        queryFn: async () => await getUser(user.uid),
    })

    const {
        data: posts,
        fetchNextPage, 
        hasNextPage,
        isLoading: isPostLoading
    } = useInfiniteQuery({
        queryKey: ['posts'],
        queryFn: async (param) => await getPosts(param),
        initialPageParam: 0,
        getNextPageParam: last => last.lastDoc
    })

    const {isPending, mutate: mutatePost} = useMutation({
        mutationFn: async () => {
            const postId = await addPost(user, postContent)

            const urls = await uploadPostMedias(postContent.attachments, user, postId, setProgress)

            await updatePost(postId, {
                attachments: arrayUnion(...urls)
            })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["posts"]})
            setPostContent(prev => ({...prev, context: "", attachments: [], attachmentPreviews: []}))
            addToast("Posted", "Your post is now live", "success")
        }
    })

    const submitPost = async () => {
        mutatePost()
    }

    const handleExpand = e => {
        e.style.height = 'auto'
        e.style.height =  e.value ? `${e.scrollHeight}px` : '2rem'
    }

    useEffect(() => {
        handleExpand(textAreaRef.current)
    }, [postContent])

    useEffect(() => {
        if(!currentUser) return

        const checkScroll = () => {
            if(window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100) {
                fetchNextPage()
            }
        }

        checkScroll()


        window.addEventListener('scroll', checkScroll)

        return () => {
            window.removeEventListener('scroll', checkScroll)
        }
    }, [currentUser, fetchNextPage])

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth'})
    }, [])

    if(!user) return <Navigate to="/login"/>
  return (
    <div className={`home primary-${theme}-bg midtone-${theme}`}>
        <div className="feed">
            <div className="news">
                <CreatePost 
                    textAreaRef={textAreaRef}
                    isLoading={isLoading}
                    currentUser={currentUser}
                    postContent={postContent}
                    setPostContent={setPostContent}
                    submitPost={submitPost}
                    isPending={isPending}
                    theme={theme}
                    progress={progress}
                />
                {posts?.pages[0].posts.length > 0 ? 
                    posts.pages.map((chunk, i) => (
                        <div key={i} className='news-posts'>
                            {chunk.posts.map(post => (
                                <Post post={post} key={post.id} currentUser={currentUser}/>
                            ))}
                        </div>
                    )) :
                    <div className="no-post">
                        {isPostLoading ? 'Loading' : 'No posts yet'}
                    </div>
                }
                {!hasNextPage && posts?.pages[0].posts.length > 1 && <div className='no-post'>You've reach the end</div>}
            </div>
        </div>
        <div className="right-panel"></div>
    </div>
  )
}

export default Feed