import React from 'react'
import '../styles/modal.css'

const Modal = ({isOpen, onClose, children, className, title, handleSubmit, submitValue, submitDisabled}) => {
    if(!isOpen) return null
  return (
    <div className={`modal-overlay`} onClick={onClose}>
    <div className={`modal-content ${className}`} onClick={(e) => e.stopPropagation()}>
        <div className="header">
            <div className="cancel" onClick={onClose}>Cancel</div>
            <h3>{title}</h3>
        </div>
        <div className="body">
            {children}
        </div>
        <div className="submit">
            <button onClick={() => handleSubmit()} disabled={submitDisabled}>{submitValue}</button>
        </div>
    </div>
  </div>
  )
}

export default Modal