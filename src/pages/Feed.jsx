import React, { useEffect, useRef, useState } from 'react'
import { useUser } from '../provider/UserProvider'
import { Navigate } from 'react-router'
import { addPost, getPosts, getUser } from '../utils/firestore'
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import '../styles/home.css'
import Post from '../components/Post'
import CreatePost from '../components/CreatePost'

const Feed = () => {
    const [postContent, setPostContent] = useState({context: '', attachments: []})
    const [user, loading] = useUser()
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
        isFetchingNextPage,
        isLoading: isPostLoading
    } = useInfiniteQuery({
        queryKey: ['posts'],
        queryFn: async (param) => await getPosts(param),
        initialPageParam: 0,
        getNextPageParam: last => last.lastDoc
    })

    const {isPending, mutate: mutatePost} = useMutation({
        mutationFn: async () => await addPost(user, postContent),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["posts"]})
            setPostContent(prev => ({...prev, context: ""}))
        }
    })

    const submitPost = async () => {
        mutatePost()
    }

    useEffect(() => {
        if(!currentUser) return

        const handleExpand = e => {
            e.target.style.height = 'auto'
            e.target.style.height = `${e.target.scrollHeight}px`
        }

        const checkScroll = () => {
            if(window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100) {
                fetchNextPage()
            }
        }

        checkScroll()

        textAreaRef.current?.addEventListener('input', handleExpand)

        window.addEventListener('scroll', checkScroll)

        return () => {
            textAreaRef.current?.removeEventListener('input', handleExpand)
            window.removeEventListener('scroll', checkScroll)
        }

    }, [currentUser])

    if(!user) return <Navigate to="/login"/>
  return (
    <div className='home'>
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