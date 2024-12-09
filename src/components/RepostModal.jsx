import React, { useEffect, useRef } from 'react'
import '../styles/repostmodal.css'
import { useTheme } from '../provider/ThemeProvider'
import dp from '../assets/defaultDP.jpg'
import Repost from './Repost'

const RepostModal = ({isOpen, close, handleRepost, currentUser, post, repostContext, setRepostContext, vidmMuted, vidRef, toggleMute, togglePaused, playIconRef, vidPaused}) => {
    const [theme] = useTheme()
    const textAreaRef = useRef()

    const handleExpand = e => {
        if(!e) return

        e.style.height = 'auto'
        e.style.height =  e.value ? `${e.scrollHeight}px` : '2.5rem'
    }

    useEffect(() => {
        handleExpand(textAreaRef.current)
    }, [repostContext])

    if(!isOpen) return


  return (
    <div className={`repost-modal`} onClick={close}>
        <div className={`modal-content primary-${theme}-bg midtone-${theme}`} onClick={e => e.stopPropagation()}>
            <div className="header">
                <div className="cancel" onClick={close}>Cancel</div>
                <h3>Repost</h3>
            </div>
            <div className="body">
                <div className="display-picture">
                    <img src={currentUser?.photoURL ? currentUser.photoURL : dp} alt={currentUser.username} />
                </div>
                <div className="content">
                    <textarea 
                        ref={textAreaRef}
                        name="post" 
                        id="post-input" 
                        rows='1' 
                        placeholder={`Add a comment`}
                        value={repostContext}
                        onChange={e => setRepostContext(e.target.value)}
                        className={`post-area midtone-${theme}`}
                    ></textarea>
                    <Repost 
                        postReference={post.isRepost ? post.repostOf : post.id}
                        vidmMuted={vidmMuted}
                        vidRef={vidRef}
                        toggleMute={toggleMute}
                        togglePaused={togglePaused}
                        playIconRef={playIconRef}
                        vidPaused={vidPaused}
                    />
                </div>
            </div>
            <div className="submit">
                <button className='post-btn' onClick={() => handleRepost(repostContext)}>Post</button>
            </div>
        </div>
    </div>
  )
}

export default RepostModal