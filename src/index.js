import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import './styles/index.css';
import App from './App';
import UserProvider from './provider/UserProvider';
import ThemeProvider from './provider/ThemeProvider';
import ToastProvider from './provider/ToastProvider';

const queryClinet = new QueryClient()

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <QueryClientProvider client={queryClinet}>
    <ToastProvider>
      <UserProvider>
        <ThemeProvider>
          <React.StrictMode>
            <App />
          </React.StrictMode>
        </ThemeProvider>
      </UserProvider>
    </ToastProvider>
  </QueryClientProvider>
);
