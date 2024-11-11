import { useQuery } from '@tanstack/react-query'
import React, { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router'
import { getFollowing, getUser } from '../utils/firestore'
import UserItem from './UserItem'

const Following = () => {
    const userId = useOutletContext()
    const [following, setFollowing] = useState([]);

    const { data: followingIds, isLoading } = useQuery({
        queryKey: ['following', userId],
        queryFn: async () => await getFollowing(userId)
    })

    useEffect(() => {
        if (isLoading || !followingIds) return;
    
        const fetchUsers = async () => {
            const users = await Promise.all(followingIds.map(id => getUser(id)));
            setFollowing(users);
        };
    
        fetchUsers();
    }, [followingIds, isLoading]);

    if(isLoading) return "Loading..."
  return (
    <div className='list'>
        {following.length > 0 && !isLoading ? 
            following.map((followedUser, idx) => <UserItem key={idx} userData={followedUser}/>) :
        followingIds.length === 0 ?
            <p>No users followed</p> :
            "Loading..."
        }
    </div>
  )
}

export default Following