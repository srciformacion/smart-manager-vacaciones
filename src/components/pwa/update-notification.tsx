
import { useEffect, useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { registerSW } from 'virtual:pwa-register';

export function UpdateNotification() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [refreshSW, setRefreshSW] = useState<(() => Promise<void>) | null>(null);

  useEffect(() => {
    const intervalMS = 60 * 60 * 1000; // 1 hour
    
    const updateSW = registerSW({
      onNeedRefresh() {
        setUpdateAvailable(true);
        setRefreshSW(() => updateSW);
        
        toast({
          title: "Nueva versión disponible",
          description: "Hay una nueva versión de la aplicación disponible.",
          action: (
            <Button 
              variant="default" 
              size="sm"
              onClick={() => updateSW?.()}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Actualizar
            </Button>
          ),
          duration: 0, // No se cierra automáticamente
        });
      },
      onOfflineReady() {
        toast({
          title: "Listo para uso sin conexión",
          description: "La aplicación está lista para usarse sin conexión.",
          duration: 3000,
        });
      },
      interval: intervalMS,
    });

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
  }, []);

  // This component doesn't render anything visually, only handles notifications
  return null;
}
