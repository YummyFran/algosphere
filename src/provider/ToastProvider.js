import React, { useCallback, useContext, useState } from 'react'
import Toast from '../components/Toast';
import '../styles/toast.css'

const ToastContext = React.createContext()

export const useToast = () => useContext(ToastContext)

const ToastProvider = ({children}) => {
    const [toasts, setToasts] = useState([]);
    
    const removeToast = useCallback((id) => {
        setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
    }, []);
    
    const addToast = useCallback((title, content, type = 'info') => {
        const id = Math.random().toString(36).substring(2, 9);

        setToasts((prevToasts) => [...prevToasts, { id, title, content, type }]);

        setTimeout(() => removeToast(id), 3000);
    }, [removeToast]);


  return (
    <ToastContext.Provider value={[addToast]}>
      {children}
      <div className="toast-container">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export default ToastProvider