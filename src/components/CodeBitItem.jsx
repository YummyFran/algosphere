import React, { useEffect, useState } from 'react'
import { iconMap, timeAgo } from '../utils/helper'
import { IoMdHeart, IoMdHeartEmpty } from 'react-icons/io'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteCodeBit, hasLikedCodeBit, likeCodeBit } from '../utils/firestore'
import { useToast } from '../provider/ToastProvider'
import { useUser } from '../provider/UserProvider'
import { useNavigate } from 'react-router'
import { useTheme } from '../provider/ThemeProvider'
import { GoTrash } from 'react-icons/go'

const CodeBitItem = ({codebit, filterBy}) => {
    const [hasLiked, setHasLiked] = useState(false)
    const queryClient = useQueryClient()
    const [addToast] = useToast()
    const [user] = useUser()
    const [theme] = useTheme()
    const nav = useNavigate()

    const {mutate: mutateLike} = useMutation({
        mutationFn: async (codebitId) => await likeCodeBit(codebitId, user.uid),
        onSuccess: (alreadyLiked) => {
            queryClient.invalidateQueries({ queryKey: ['codebits', filterBy]})

            if (alreadyLiked) {
                setHasLiked(false)
                addToast("Disliked!", 'You disliked this codebit', 'error')
            } else {
                setHasLiked(true)
                addToast("Liked!", "You liked this codebit")
            }
        }
    })

    const {mutate: mutateDelete} = useMutation({
        mutationFn: async (codebitId) => await deleteCodeBit(codebitId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['codebits', filterBy] })
            addToast("Codebit deleted!", "This codebit has been deleted", "error")
        }
    })

    const handleLike = (id, e) => {
        e.stopPropagation()
        mutateLike(id)
    }

    const handleDelete = (id, e) => {
        e.stopPropagation()
        mutateDelete(id)   
    }

    useEffect(() => {
        const checkLike = async () => {
            const liked = await hasLikedCodeBit(codebit.id, user.uid)

            setHasLiked(liked)
        }

        checkLike()
    }, [])

  return (
    <div className='code-bit' onClick={() => nav(`/codebit/${codebit.id}`)}>
        <div className="icon">
            <img src={iconMap[codebit.language]} alt="" />
        </div>
        <div className="info">
            <div className="name">{codebit.title}</div>
            <div className="details">
                <div className="username">@{codebit.author.username}</div>
                <div className="language">{codebit.language}</div>
                <div className="timestamp">{timeAgo(codebit.createdAt)}</div>
            </div>
        </div>
        {codebit.public ?
            <div className={`likes ${hasLiked ? 'liked' : ''} ${theme}-hover`} onClick={(e) => handleLike(codebit.id, e)}>
                {hasLiked ? <IoMdHeart /> : <IoMdHeartEmpty />}
                {codebit.likes > 0 && codebit.likes}
            </div>
        : 
            <div className={`private secondary-${theme}-bg`}>Private</div>
        }
        {filterBy === 'mycodebits' &&
            <div 
                className={`delete ${theme}-hover`} 
                style={{
                    color: 'var(--error-color)', 
                    padding: '0.5rem', 
                    borderRadius: '1rem', 
                    display: 'flex', 
                    alignItems: 'center'
                }}
                onClick={e => handleDelete(codebit.id, e)}
            >
                <GoTrash />
            </div>
        }
    </div>
  )
}

export default CodeBitItem