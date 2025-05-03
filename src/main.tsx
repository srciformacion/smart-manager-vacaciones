
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { UpdateNotification } from './components/pwa/update-notification.tsx'
import { registerSW } from 'virtual:pwa-register'

// Register service worker using vite-plugin-pwa
const updateSW = registerSW({
  onNeedRefresh() {
    // The PWA needs to be refreshed
    console.log('New content is available, please refresh.')
  },
  onOfflineReady() {
    // The PWA is ready to work offline
    console.log('App is ready for offline use.')
  }
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <UpdateNotification />
    <App />
  </React.StrictMode>,
)
