import React from 'react'
import { getFileType } from '../utils/helper'
import { IoPause, IoPlay, IoVolumeHigh, IoVolumeMute } from 'react-icons/io5'

const PostAttachments = ({post, vidmMuted, vidRef, toggleMute, togglePaused, playIconRef, vidPaused}) => {
  return (
    <div className="medias">
        {post.attachments.map((link, i) => {

            const fileType = getFileType(link)
            
            return (
                <div className="media" key={i}>
                    {fileType === "Image" ?
                        <img src={link} alt="Attachment Preview" className="attachment-preview" /> :
                        <div className="video" onClick={() => togglePaused()}>
                            <video muted={vidmMuted} loop autoPlay ref={vidRef}>
                                <source src={link} type="video/mp4" />
                            </video>
                            <div className={`toggle-mute`} onClick={toggleMute}>{vidmMuted ? <IoVolumeMute /> : <IoVolumeHigh />}</div>
                            <div className={`toggle-pause`} ref={playIconRef}>{!vidPaused ? <IoPlay /> : <IoPause />}</div>
                        </div>
                    }
                </div>
            )
        })}
    </div>
  )
}

export default PostAttachments