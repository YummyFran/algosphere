import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import React, { useEffect, useState } from 'react'
import { getPost, getUser, getUserPosts } from '../utils/firestore'
import Post from './Post'
import { useUser } from '../provider/UserProvider'
import { useOutletContext } from 'react-router'
import Loading from './Loading'

const Timeline = () => {
  const [user] = useUser()
  const [timelineUser, username, isTimelineUserLoading] = useOutletContext()

  const {data: currentUser} = useQuery({
    queryKey: ['user'],
    queryFn: async () => await getUser(user.uid)
  })

  const {data: pinnedPost} = useQuery({
    queryKey: ['pinnedPost', timelineUser?.pinnedPost],
    queryFn: async () => {
      if(!timelineUser.pinnedPost) return

      return await getPost(timelineUser?.pinnedPost)
    }
  })

  const {
    data: posts,
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage,
    isLoading: isPostLoading,
  } = useInfiniteQuery({
    queryKey: ['userposts', timelineUser?.uid],
    queryFn: async (param) => await getUserPosts(param, timelineUser?.uid),
    initialPageParam: 0,
    getNextPageParam: last => last?.lastDoc
  })

  useEffect(() => {
    if(!currentUser) return

    window.scrollTo(0,0)

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
    if(!currentUser) return


  }, [currentUser])

  if(isTimelineUserLoading || posts?.pages[0]?.posts[0]?.userId !== timelineUser?.uid) return <Loading />

  return (
    <div className='timeline'>
      {pinnedPost && 
        <Post post={pinnedPost} currentUser={currentUser} isPinned={true}/>
      }
      {posts?.pages[0].posts.length > 0 ? 
          posts?.pages.map((chunk, i) => (
              <div key={i} className='news-posts'>
                  {chunk.posts.map(post => {
                    const isPinned = post.id === currentUser.pinnedPost

                    if(isPinned) return
                    return(
                      <Post post={post} key={post.id} currentUser={currentUser}/>
                  )})}
              </div>
          )) :
          <div className="no-post">
              {isPostLoading ? 'Loading' : 'No posts yet'}
          </div>
      }
      {isFetchingNextPage && "loading..."}
      {!hasNextPage && posts?.pages[0].posts.length > 1 && <div className='no-post'>You've reach the end</div>}
    </div>
  )
}

export default Timeline