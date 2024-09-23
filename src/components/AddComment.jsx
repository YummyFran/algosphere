import React, { useEffect, useRef } from 'react'

const AddComment = ({ 
    commentContent, 
    setCommentContent,
    submitComment
}) => {
    const textAreaRef = useRef()

    useEffect(() => {

        const handleExpand = e => {
            e.target.style.height = 'auto'
            e.target.style.height = `${e.target.scrollHeight}px`
        }

        textAreaRef.current?.addEventListener('input', handleExpand)

        return () => {
            textAreaRef.current?.removeEventListener('input', handleExpand)
        }
    }, [])

  return (
    <div className='add-comment'>
        <textarea 
            name="comment"
            value={commentContent.context}
            onChange={(e) => setCommentContent(prev => ({...prev, context: e.target.value}))}
            rows={1}
            placeholder={`Enter a comment`}
            ref={textAreaRef}
        ></textarea>
        <div className="attachments">
            <button onClick={submitComment} disabled={commentContent.context.length == 0}>Comment</button>
        </div>
    </div>
  )
}

export default AddComment