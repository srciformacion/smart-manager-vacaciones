
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { UpdateNotification } from './components/pwa/update-notification.tsx'
import { registerSW } from 'virtual:pwa-register'

// Register Service Worker
if ('serviceWorker' in navigator) {
  // Use vite-plugin-pwa's registerSW instead of manual registration
  const updateSW = registerSW({
    onNeedRefresh() {
      // This will be handled by the UpdateNotification component
      console.log('New content available, please refresh.');
    },
    onOfflineReady() {
      console.log('App ready to work offline');
    },
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <UpdateNotification />
    <App />
  </React.StrictMode>,
)
