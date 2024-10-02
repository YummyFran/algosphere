import React, { useEffect, useRef } from 'react'
import { LuSendHorizonal } from "react-icons/lu";
import { useTheme } from '../provider/ThemeProvider';

const AddComment = ({ 
    commentContent, 
    setCommentContent,
    submitComment,
    placeholder,
    replyRef,
    isCommenting
}) => {
    const textAreaRef = useRef()
    const [theme, setTheme] = useTheme()

    const setTextareaRefs = (el) => {
        textAreaRef.current = el;
        if (replyRef) {
            replyRef.current = el;
        }
    };

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
            placeholder={placeholder ? placeholder : "Enter a comment"}
            ref={setTextareaRefs}
            className={`mono-${theme}-bg midtone-${theme}`}
        ></textarea>
        <div className="attachments">
            <button onClick={submitComment} disabled={commentContent.context.length == 0 || isCommenting}><LuSendHorizonal /></button>
        </div>
    </div>
  )
}

export default AddComment