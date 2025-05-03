
import { useEffect, useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

export function UpdateNotification() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    // Verificar si service worker está disponible
    if ('serviceWorker' in navigator) {
      // Escuchar eventos del service worker
      const handleUpdate = (reg: ServiceWorkerRegistration) => {
        // Si hay un nuevo service worker esperando
        if (reg.waiting) {
          setUpdateAvailable(true);
          setRegistration(reg);
          
          toast({
            title: "Nueva versión disponible",
            description: "Hay una nueva versión de la aplicación disponible.",
            action: (
              <Button 
                variant="default" 
                size="sm"
                onClick={() => updateServiceWorker(reg)}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                Actualizar
              </Button>
            ),
            duration: 0, // No se cierra automáticamente
          });
        }
      };

      // Verificar si ya hay un service worker registrado
      navigator.serviceWorker.getRegistration().then((reg) => {
        if (reg) {
          handleUpdate(reg);
          
          // Escuchar nuevas actualizaciones
          reg.addEventListener('updatefound', () => {
            const newWorker = reg.installing;
            
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  handleUpdate(reg);
                }
              });
            }
          });
        }
      });

      // Detectar cuando un nuevo service worker toma el control
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        // Recargar para usar la nueva versión
        window.location.reload();
      });
    }
  }, []);

  const updateServiceWorker = (reg: ServiceWorkerRegistration) => {
    if (reg.waiting) {
      // Enviar mensaje al service worker para que se active
      reg.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
  };

  // Este componente no renderiza nada visualmente, solo maneja las notificaciones
  return null;
}
