import React, { useEffect, useState } from 'react'
import { Outlet, useNavigate, useParams } from 'react-router'
import { checkIfFollowing, followUser, getUserByUsername, unFollowUser, updateUserDetails } from '../utils/firestore'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { IoArrowBackOutline } from 'react-icons/io5'
import { MdModeEdit } from "react-icons/md";
import "../styles/profile.css"
import { useTheme } from '../provider/ThemeProvider'
import { AiOutlineMore } from 'react-icons/ai'
import { useUser } from '../provider/UserProvider'
import { Link, NavLink } from 'react-router-dom'
import { useToast } from '../provider/ToastProvider'
import dp from '../assets/defaultDP.jpg'
import Modal from '../components/Modal'
import Loading from '../components/Loading'

const Profile = () => {
    const { username } = useParams()
    const [theme] = useTheme()
    const [currentUser] = useUser()
    const [addToast] = useToast()
    const [isFollowPending, setIsFollowPending] = useState(false)
    const [isSavingPending, setIsSavingPending] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [userDetails, setUserDetails] = useState({photoURL: '', name: '', bio: '', file: null})
    const queryClient = useQueryClient()
    const nav = useNavigate()

    const { data: user, isLoading, refetch } = useQuery({
        queryKey: ["userdata"],
        queryFn: async () => await getUserByUsername(username)
    })

    const { data: isFollowing } = useQuery({
        queryKey: ["isFollowing", user?.uid],
        queryFn: async () => await checkIfFollowing(currentUser?.uid, user.uid)
    })


    const { mutate: mutateFollow } = useMutation({
        mutationFn: async () => await followUser(currentUser?.uid, user.uid),
        onMutate: () => {
            setIsFollowPending(true)
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["isFollowing", user?.uid])
            setIsFollowPending(false)
            addToast("Followed", `You are now following ${user?.username}`, "success")
        },
        onError: () => {
            setIsFollowPending(false)
        }
    })

    const { mutate: mutateUnFollow } = useMutation({
        mutationFn: async () => await unFollowUser(currentUser?.uid, user.uid),
        onMutate: () => {
            setIsFollowPending(true)
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["isFollowing", user?.uid])
            setIsFollowPending(false)
            addToast("Unfollowed", `You unfollowed ${user?.username}`, "info")
        },
        onError: () => {
            setIsFollowPending(false)
        }
    })

    const { mutate: mutateUser } = useMutation({
        mutationFn: async () => await updateUserDetails(currentUser, {
            name: userDetails.name,
            file: userDetails.file,
            bio: userDetails.bio,
            photoURL: userDetails.photoURL
        }),
        onMutate: () => {
            setIsSavingPending(true)
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['userdata'])
            setIsSavingPending(false)
            addToast("Saved!", "Your profile is successfully updated")
            closeEditModal()
        }
    })

    const handleSave = () => {
        mutateUser()
    }

    const handlePhotoChange = (e) => {
        const image = URL.createObjectURL(e.target.files[0])

        setUserDetails(prev => ({...prev, photoURL: image, file: e.target.files[0]}))
    }

    const closeEditModal = () => {
        setIsEditModalOpen(false)
    }

    useEffect(() => {
        refetch()
    }, [username, refetch])

    useEffect(() => {
        if (user && !userDetails.photoURL && !userDetails.name && !userDetails.bio) {
            setUserDetails({
                photoURL: user.photoURL,
                name: user.displayName,
                bio: user.bio,
            })
        }
    }, [user])

    if (isLoading || username !== user?.username) return <Loading />
  return (
    <div className={`profile-page primary-${theme}-bg midtone-${theme}`}>
        <Modal 
            isOpen={isEditModalOpen} 
            onClose={closeEditModal} 
            className={`edit-profile-modal primary-${theme}-bg`} 
            title={'Edit Profile'} 
            submitValue={isSavingPending ? 'Saving' : 'Save'} 
            handleSubmit={handleSave} 
            submitDisabled={isSavingPending || (user.displayName === userDetails.name && user.photoURL === userDetails.photoURL && user.bio === userDetails.bio)}
        >
            <div className="details">
                <div className={`name mono-${theme}-border`}>
                    <label htmlFor="name" className={`mono-${theme}`}>Name</label>
                    <input id='name' type="text" value={userDetails.name} onChange={(e) => setUserDetails(prev => ({...prev, name: e.target.value}))} autoComplete="off"/>
                </div>
                <div className={`bio mono-${theme}-border`}>
                    <label htmlFor="bio" className={`mono-${theme}`}>Bio</label>
                    <input id='bio' type="text" value={userDetails.bio} onChange={(e) => setUserDetails(prev => ({...prev, bio: e.target.value}))} />
                </div>
            </div>
            <label htmlFor='dp-input' className="photo">
                <img src={userDetails?.photoURL ? userDetails.photoURL : dp} alt={user?.displayName}/>
                <div className="hover-overlay">
                    <MdModeEdit />
                </div>
            </label>
            <input type="file" id="dp-input" className='change-dp' onChange={handlePhotoChange} accept='image/*'/>
        </Modal>
        <div className="profile">
            <div className="header">
                <div className={`back ${theme}-hover`} onClick={() => nav(-1)}>
                    <IoArrowBackOutline />
                </div>
                <p>{user.uid === currentUser?.uid ? "Profile" : user.username}</p>
                <div className={`meatball ${theme}-hover`}>
                    <AiOutlineMore />
                </div>
            </div>
            <div className="profile-card">
                <div className="profile-details">
                    <div className="display-names">
                        <div className="name">{user.displayName}</div>
                        <div className="username">@{user.username}</div>
                    </div>
                    <div className={`profile-picture secondary-${theme}-bg`}>
                        <img src={user?.photoURL ? user.photoURL : dp} alt={user?.displayName}/>
                    </div>
                </div>
                <div className="bio">{user.bio}</div>
                <div className="metrics">
                    <div className={`reputation ${theme}-hover`}>
                        <div className="count">10</div>
                        <div className="title">Reputation</div>
                    </div>
                    <Link to={'following'} className={`following ${theme}-hover`}>
                        <div className="count">{user?.followingCount ? user?.followingCount : 0}</div>
                        <div className="title">Following</div>
                    </Link>
                    <Link to={'followers'} className={`followers ${theme}-hover`}>
                        <div className="count">{user?.followersCount ? user?.followersCount : 0}</div>
                        <div className="title">Followers</div>
                    </Link>
                </div>
                <div className="cta">
                {user.uid === currentUser?.uid ? 
                    <button className={`edit midtone-${theme}`} onClick={() => setIsEditModalOpen(true)}>Edit Profile</button> :
                    <>
                        <button className={`follow-btn ${isFollowing ? "following" : "follow"} midtone-${theme}`} onClick={() => isFollowing ? mutateUnFollow() : mutateFollow()} disabled={isFollowPending}>{isFollowing ? "Following" : "Follow"}</button>
                        <button className={`message midtone-${theme}`}>Message</button>
                    </>
                }
                </div>
            </div>
            <div className={`profile-nav midtone-${theme}`}>
                <NavLink to={`/${user.username}`} className={({ isActive }) => `${isActive ? 'active-link' : ''}`} end replace>Posts</NavLink>
                <NavLink to={`saved`} className={({ isActive }) => `${isActive ? 'active-link' : ''}`} replace>Saved</NavLink>
                <NavLink to={`reposts`} className={({ isActive }) => `${isActive ? 'active-link' : ''}`} replace>Reposts</NavLink>
            </div>
            <Outlet context={[user, username, isLoading]}/>
        </div>
    </div>
  )
}

export default Profile