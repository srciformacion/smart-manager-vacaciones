
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { UpdateNotification } from './components/pwa/update-notification.tsx'
import { Toaster } from 'sonner'
import { registerSW } from 'virtual:pwa-register'

// Register service worker using vite-plugin-pwa
const updateSW = registerSW({
  onNeedRefresh() {
    // The PWA needs to be refreshed
    console.log('Nueva versión disponible, por favor actualiza.')
  },
  onOfflineReady() {
    // The PWA is ready to work offline
    console.log('App lista para uso sin conexión.')
  }
})

// Setup communication with service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'GET_PENDING_REQUESTS') {
      const pendingRequests = localStorage.getItem('pendingRequests') || '[]';
      
      // Respond with pending requests data
      if (event.source) {
        event.source.postMessage({
          type: 'PENDING_REQUESTS_DATA',
          pendingRequests
        });
      }
    }
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Toaster richColors position="top-right" />
    <UpdateNotification />
    <App />
  </React.StrictMode>,
)
