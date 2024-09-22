import React from 'react'

const CreatePost = ({
    textAreaRef,
    isLoading,
    currentUser,
    postContent,
    setPostContent,
    submitPost,
    isPending
}) => {
  return (
    <div className="create-post">
        <div className="context">
            <div className="display-photo">
            </div>
            <textarea 
                ref={textAreaRef} 
                name="post" 
                id="post-input" 
                rows='1' 
                placeholder={`What's new, ${isLoading ? "Today" : currentUser?.displayName.split(' ')[0]}?`}
                value={postContent.context}
                onChange={e => setPostContent(prev => ({...prev, context: e.target.value}))}
            ></textarea>
        </div>
        <div className="attachments">
            <button onClick={() => submitPost()} disabled={postContent.context.length == 0 || isPending}>{isPending ? 'Posting' : 'Post'} </button>
        </div>
    </div>
  )
}

export default CreatePost