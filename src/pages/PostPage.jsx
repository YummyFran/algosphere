import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { addComment, getComments, getPost, getUser } from '../utils/firestore'
import { useUser } from '../provider/UserProvider'
import AddComment from '../components/AddComment'
import Post from '../components/Post'
import Comment from '../components/Comment'
import '../styles/postpage.css'

const PostPage = () => {
    const [commentContent, setCommentContent] = useState({context: '', attachments: []})
    const { username, postId } = useParams()
    const [user, loading] = useUser()
    const queryClient = useQueryClient()

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
        getNextPageParam: last => last.lastDoc,
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

        return () => {
            window.removeEventListener('scroll', checkScroll)
        }
    }, [])

    if(isLoading || loadingUser) return "Loading..."
  return (
    <div className='post-page'>
        <div className="post-container">
            <Post post={post} currentUser={currentUser}/>
            <div className="divider">
                <div className="replies">Replies</div>
                <div className="view-activity">View Activity</div>
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
                            <Comment comment={comment} key={comment.id} currentUser={currentUser} parentsId={[post.id]}/>
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