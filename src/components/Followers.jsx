import { useQuery } from '@tanstack/react-query'
import React, { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router'
import { getFollowers, getUser } from '../utils/firestore'
import UserItem from './UserItem'
import Loading from './Loading'

const Followers = () => {
    const userId = useOutletContext()
    const [followers, setFollowers] = useState([]);

    const { data: followersId, isLoading } = useQuery({
        queryKey: ['followers', userId],
        queryFn: async () => await getFollowers(userId)
    })

    useEffect(() => {
        if (isLoading || !followersId) return;
    
        const fetchUsers = async () => {
            const users = await Promise.all(followersId.map(id => getUser(id)));
            setFollowers(users);
        };
    
        fetchUsers();
    }, [followersId, isLoading]);

    if(isLoading) return <Loading />
  return (
    <div className='list'>
        {followers.length > 0 && !isLoading ?
            followers.map((follower, idx) => <UserItem key={idx} userData={follower}/>) :
        followersId.length === 0 ?
            <p>No Followers</p> :
            <Loading />
        }
    </div>
  )
}

export default Followers