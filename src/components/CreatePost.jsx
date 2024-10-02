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
    theme
}) => {
    const handleFileChange = e => {
        const files = Array.from(e.target.files)
        const previews = files.map(file => URL.createObjectURL(file))
        setPostContent(prev => ({...prev, 
            attachments: [...prev.attachments, ...files],
            attachmentPreviews: [...prev.attachmentPreviews, ...previews]
        }))
    }

    const removeAttachment = i => {
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
    <div className={`create-post ${theme}-shadow`}>
        <div className="context">
            <div className={`display-photo mono-${theme}-bg`}>
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
                                <img key={link} src={link} alt="Attachment Preview" className="attachment-preview" />
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
            <input type="file" name="" id='add-file' multiple onChange={handleFileChange}/>
            <button onClick={() => submitPost()} disabled={postContent.context.length == 0 || isPending}>{isPending ? 'Posting' : 'Post'} </button>
        </div>
    </div>
  )
}

export default CreatePost