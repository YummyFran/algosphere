import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { addComment, getComments, getPost, getUser } from '../utils/firestore'
import { useUser } from '../provider/UserProvider'
import AddComment from '../components/AddComment'
import Post from '../components/Post'
import Comment from '../components/Comment'
import '../styles/postpage.css'
import { useTheme } from '../provider/ThemeProvider'
import { IoArrowBackOutline } from 'react-icons/io5'
import { Link } from 'react-router-dom'

const PostPage = () => {
    const [commentContent, setCommentContent] = useState({context: '', attachments: []})
    const { username, postId } = useParams()
    const [user, loading] = useUser()
    const [theme, setTheme] = useTheme()
    const queryClient = useQueryClient()
    const nav = useNavigate()

    const {data: currentUser, isLoading: loadingUser} = useQuery({
        queryKey: ['user'],
        queryFn: async () => await getUser(user.uid),
    })

    const { data: post, isLoading } = useQuery({
        queryKey: ['post', postId],
        queryFn: async () => await getPost(postId)
    })

    const {
        data: comments,
        fetchNextPage, 
        hasNextPage, 
        isFetchingNextPage,
        isLoading: isCommentsLoading
    } = useInfiniteQuery({
        queryKey: ['comments', postId, user?.uid],
        queryFn: async (param) => {
            if (user?.uid && postId) {
                return await getComments(param, user.uid, postId)
            }
        },
        initialPageParam: null,
        getNextPageParam: last => last?.lastDoc,
        enabled: !!user && !!post
    })

    const {isPending: isCommenting, mutate: mutateComments} = useMutation({
        mutationFn: async () => await addComment(user.uid, post.id, commentContent),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["comments"]})
            setCommentContent(prev => ({...prev, context: ""}))
        }
    })

    const submitComment = () => {
        mutateComments()
    }

    useEffect(() => {
        const checkScroll = () => {
            if(window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100) {
                fetchNextPage()
            }
        }

        checkScroll()

        window.addEventListener('scroll', checkScroll)

        window.scrollTo(0,0)

        return () => {
            window.removeEventListener('scroll', checkScroll)
        }
    }, [])

    if(isLoading || loadingUser) return "Loading..."
  return (
    <div className={`post-page primary-${theme}-bg midtone-${theme}`}>
        <div className="post-container">
            <div className="header">
                <div className={`back ${theme}-hover`} onClick={() => nav(-1)}>
                    <IoArrowBackOutline />
                </div>
                <p>AlgoSphere</p>
            </div>
            <Post post={post} currentUser={currentUser}/>
            <div className={`divider mono-${theme}-border`}>
                <div className="replies">Replies</div>
                <Link to='activity' className="view-activity">View Activity</Link>
            </div>
            <AddComment 
                commentContent={commentContent}
                setCommentContent={setCommentContent}
                submitComment={submitComment}
                isCommenting={isCommenting}
            />
            {comments?.pages[0].comments.length > 0 ? 
                comments.pages.map((chunk, i) => (
                    <div key={i} className='comment'>
                        {chunk.comments.map(comment => (
                            <Comment comment={comment} key={comment.id} currentUser={currentUser} parentsId={[post.id]} theme={theme}/>
                        ))}
                    </div>
                )) :
                <div className="no-post">
                    {isCommentsLoading ? 'Loading' : 'No Commments yet'}
                </div>
            }
        </div>
    </div>
  )
}

export default PostPage