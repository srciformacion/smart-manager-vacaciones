
import { useEffect, useState } from 'react';
import { toast } from "sonner";
import { Button } from '@/components/ui/button';
import { Download, Wifi, WifiOff } from 'lucide-react';
import { registerSW } from 'virtual:pwa-register';
import { syncPendingRequests } from '@/utils/background-sync';

export function UpdateNotification() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [refreshSW, setRefreshSW] = useState<(() => Promise<void>) | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

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

    // Monitor online/offline status
    const handleOnline = () => {
      setIsOnline(true);
      toast.success("Conexión restablecida", {
        description: "Sincronizando datos pendientes...",
        icon: <Wifi className="h-4 w-4" />,
        duration: 3000,
      });

      // Trigger background sync when online
      if ('serviceWorker' in navigator && 'SyncManager' in window) {
        navigator.serviceWorker.ready
          .then(registration => {
            registration.sync.register('sync-pending-requests')
              .then(() => console.log('Background sync registered'))
              .catch(err => {
                console.error('Background sync registration failed:', err);
                // Fallback: manual sync
                syncPendingRequests().then(({ success, errors }) => {
                  if (success > 0) {
                    toast.success(`${success} solicitudes sincronizadas`, {
                      duration: 3000,
                    });
                  }
                  if (errors > 0) {
                    toast.error(`${errors} errores de sincronización`, {
                      duration: 3000,
                    });
                  }
                });
              });
          })
          .catch(error => console.error('Service worker not ready:', error));
      } else {
        // Fallback for browsers without background sync
        syncPendingRequests().then(({ success, errors }) => {
          if (success > 0) {
            toast.success(`${success} solicitudes sincronizadas`, {
              duration: 3000,
            });
          }
          if (errors > 0) {
            toast.error(`${errors} errores de sincronización`, {
              duration: 3000,
            });
          }
        });
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast.error("Conexión perdida", {
        description: "La aplicación funcionará en modo offline.",
        icon: <WifiOff className="h-4 w-4" />,
        duration: 3000,
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Listen for messages from service worker
    if (navigator.serviceWorker) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'SYNC_COMPLETED') {
          const { total, success, failed } = event.data.results;
          
          if (success > 0) {
            toast.success(`${success} de ${total} solicitudes sincronizadas`, {
              duration: 3000,
            });
          }
          
          if (failed > 0) {
            toast.error(`${failed} solicitudes no pudieron sincronizarse`, {
              duration: 4000,
            });
          }
        }
      });
    }

    // Clean up event listeners on component unmount
    return () => {
      clearInterval(intervalId);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // This component doesn't render anything visually, only handles notifications
  return null;
}
