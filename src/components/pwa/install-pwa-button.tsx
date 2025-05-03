
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

// Extend Window interface to include the MSStream property
declare global {
  interface Window {
    MSStream?: any;
  }
}

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function InstallPWAButton() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Detectar si la app ya está instalada
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // Capturar el evento beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevenir que Chrome muestre el diálogo automático
      e.preventDefault();
      // Guardar el evento para usarlo más tarde
      setInstallPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    // Detectar cuando la app se ha instalado
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setInstallPrompt(null);
      toast({
        title: "¡Aplicación instalada!",
        description: "La Rioja Cuida se ha instalado correctamente en tu dispositivo."
      });
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', () => {});
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) {
      // Si no hay evento de instalación disponible pero estamos en iOS
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window.MSStream);
      
      if (isIOS) {
        toast({
          title: "Instalar en iOS",
          description: "Toca el botón 'Compartir' y selecciona 'Añadir a pantalla de inicio'",
          duration: 8000,
        });
      } else {
        toast({
          title: "Instalación no disponible",
          description: "Esta aplicación ya está instalada o tu navegador no soporta PWA",
          variant: "destructive",
        });
      }
      return;
    }

    // Mostrar el diálogo de instalación
    await installPrompt.prompt();
    
    // Esperar la respuesta del usuario
    const choiceResult = await installPrompt.userChoice;
    
    if (choiceResult.outcome === 'accepted') {
      console.log('Usuario aceptó la instalación');
    } else {
      console.log('Usuario rechazó la instalación');
    }
    
    // Limpiar el prompt guardado
    setInstallPrompt(null);
  };

  // No mostrar el botón si ya está instalada o no es posible instalar
  if (isInstalled || (!installPrompt && !(/iPad|iPhone|iPod/.test(navigator.userAgent) && !(window.MSStream)))) {
    return null;
  }

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={handleInstallClick}
      className="gap-2"
    >
      <Download className="h-4 w-4" />
      Instalar App
    </Button>
  );
}
