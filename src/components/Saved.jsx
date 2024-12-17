import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import React, { useEffect } from 'react'
import { getUser, getUserReposts, getUserSavedPosts } from '../utils/firestore'
import Post from './Post'
import { useUser } from '../provider/UserProvider'
import { useOutletContext } from 'react-router'

const Saved = () => {
  const [user] = useUser()
  const [timelineUser, username, isTimelineUserLoading] = useOutletContext()

  const {data: currentUser} = useQuery({
    queryKey: ['user'],
    queryFn: async () => await getUser(user.uid)
  })

  const {
    data: posts,
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage,
    isLoading: isPostLoading,
  } = useInfiniteQuery({
    queryKey: ['user-saved-posts', timelineUser?.uid],
    queryFn: async (param) => await getUserSavedPosts(param, timelineUser?.uid),
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

  if(isTimelineUserLoading) return <div>Loading...</div>

  return (
    <div className='timeline'>
      {posts?.pages[0].posts.length > 0 ? 
          posts?.pages.map((chunk, i) => (
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
      {isFetchingNextPage && "loading..."}
      {!hasNextPage && posts?.pages[0].posts.length > 1 && <div className='no-post'>You've reach the end</div>}
    </div>
  )
}

export default Saved