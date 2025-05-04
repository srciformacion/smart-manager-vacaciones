
import { useEffect, useState } from 'react';
import { toast } from "sonner";
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { registerSW } from 'virtual:pwa-register';

export function UpdateNotification() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [refreshSW, setRefreshSW] = useState<(() => Promise<void>) | null>(null);

  useEffect(() => {
    // Check for updates every hour
    const intervalMS = 60 * 60 * 1000; 
    
    const updateSW = registerSW({
      onNeedRefresh() {
        setUpdateAvailable(true);
        setRefreshSW(() => updateSW);
        
        toast.message("Nueva versión disponible", {
          description: "Hay una nueva versión de la aplicación disponible.",
          action: {
            label: "Actualizar",
            onClick: () => updateSW?.(),
          },
          duration: 0, // No se cierra automáticamente
        });
      },
      onOfflineReady() {
        toast.success("Listo para uso sin conexión", {
          description: "La aplicación está lista para usarse sin conexión.",
          duration: 3000,
        });
      },
      // The interval is not supported in the type definition, so we need to remove it
      // Instead we'll use a custom manual check mechanism
    });

    // Set up a manual periodic check if needed
    const intervalId = setInterval(() => {
      updateSW(true); // Force check for updates
    }, intervalMS);

    // Legacy service worker registration (as fallback)
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then(registration => {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
          })
          .catch(error => {
            console.log('ServiceWorker registration failed: ', error);
          });
      });
    }

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  // This component doesn't render anything visually, only handles notifications
  return null;
}
