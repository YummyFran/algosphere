import React from 'react'
import { IoCloseOutline, IoImagesOutline } from "react-icons/io5";

const CreatePost = ({
    textAreaRef,
    isLoading,
    currentUser,
    postContent,
    setPostContent,
    submitPost,
    isPending,
    theme,
    progress
}) => {
    const handleFileChange = e => {
        console.log('changed')
        const files = Array.from(e.target.files)
        
        const hasVids = files.filter(file => file.type === 'video/mp4').length > 0 ||
                        postContent.attachments.filter(file => file.type === 'video/mp4').length > 0
        
        console.log(hasVids, postContent.attachments.length > 0)

        if(hasVids && postContent.attachments.length > 0) {
            alert("attachments can only contain one video or multiple images without video")
            return
        }
            
        const previews = files.map(file => URL.createObjectURL(file))
        setPostContent(prev => ({...prev, 
            attachments: [...prev.attachments, ...files],
            attachmentPreviews: [...prev.attachmentPreviews, ...previews]
        }))
    }

    const removeAttachment = i => {
        console.log("click")
        setPostContent(prev => {
            const remainingFiles = [...prev.attachments]
            const remainingPrevs = [...prev.attachmentPreviews]
            remainingFiles.splice(i, 1)
            remainingPrevs.splice(i, 1)

            return {
                ...prev,
                attachments: remainingFiles,
                attachmentPreviews: remainingPrevs
            }
        })
    }
  return (
    <div className={`create-post ${theme}-shadow ${isPending ? 'posting':''}`}>
        <div className="context">
            <div className={`display-photo mono-${theme}-bg`}>
                {currentUser?.photoURL && <img src={currentUser.photoURL} />}
            </div>
            <div className={`datas mono-${theme}-border`}>
                <textarea 
                    ref={textAreaRef} 
                    name="post" 
                    id="post-input" 
                    rows='1' 
                    placeholder={`What's new, ${isLoading ? "Today" : currentUser?.displayName.split(' ')[0]}?`}
                    value={postContent.context}
                    onChange={e => setPostContent(prev => ({...prev, context: e.target.value}))}
                    className={`post-area midtone-${theme}`}
                ></textarea>
                {postContent.attachmentPreviews.length > 0 &&
                    <div className="medias">
                        {postContent.attachmentPreviews.map((link, i) => (
                            <div className="media" key={i}>
                                <div className="close" onClick={() => removeAttachment(i)}><IoCloseOutline /></div>
                                <div className="progress" style={{ width: `${progress[i] ? progress[i] : 0}%`}}></div>
                                {
                                    postContent.attachments[i].type === 'video/mp4' ?
                                    <video>
                                        <source src={link}/>
                                    </video> :
                                    <img key={link} src={link} alt="Attachment Preview" className="attachment-preview" />
                                }
                            </div>
                        ))}
                    </div>
                }
            </div>
        </div>
        <div className="attachments">
            <label htmlFor="add-file" className={`add-file mono-${theme}`} title='add media'>
                <IoImagesOutline />
            </label>
            <input type="file" name="" id='add-file' multiple onChange={handleFileChange} accept='image/*,video/*'/>
            <button onClick={() => submitPost()} disabled={postContent.context.length == 0 || isPending}>{isPending ? 'Posting' : 'Post'} </button>
        </div>
    </div>
  )
}

export default CreatePost