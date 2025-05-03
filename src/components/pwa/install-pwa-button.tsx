
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
    // Detect if the app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // Capture the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent Chrome from automatically showing the prompt
      e.preventDefault();
      // Store the event for later use
      setInstallPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    // Detect when the app has been installed
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
      // If no installation event is available but we're on iOS
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

    // Show the installation dialog
    await installPrompt.prompt();
    
    // Wait for the user's choice
    const choiceResult = await installPrompt.userChoice;
    
    if (choiceResult.outcome === 'accepted') {
      console.log('User accepted the installation');
    } else {
      console.log('User dismissed the installation');
    }
    
    // Clear the saved prompt
    setInstallPrompt(null);
  };

  // Don't show the button if already installed or not possible to install
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
