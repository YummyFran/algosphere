import React from 'react';

const Toast = ({ message, type, onClose }) => {
  return (
    <div className={`toast toast-${type} dark-shadow`}>
      <div className="indicator"></div>
      <div className="message">
        <div className="title">{message.title}</div>
        <div className="content">{message.content}</div>
      </div>
      <button onClick={onClose}>&times;</button>
    </div>
  );
};

export default Toast;
