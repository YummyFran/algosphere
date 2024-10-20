import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import React from 'react'
import { getUser, getUserPosts } from '../utils/firestore'
import Post from './Post'
import { useUser } from '../provider/UserProvider'
import { useOutletContext } from 'react-router'

const Timeline = () => {
  const [user, loading] = useUser()
  const [timelineUser, username, isTimelineUserLoading] = useOutletContext()

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
    queryKey: ['posts', 'userposts'],
    queryFn: async (param) => await getUserPosts(param, timelineUser?.uid),
    initialPageParam: 0,
    getNextPageParam: last => last?.lastDoc
  })

  if(isTimelineUserLoading || posts?.pages[0]?.posts[0]?.userId != timelineUser?.uid) return <div>Loading...</div>

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
      {!hasNextPage && posts?.pages[0].posts.length > 1 && <div className='no-post'>You've reach the end</div>}
    </div>
  )
}

export default Timeline