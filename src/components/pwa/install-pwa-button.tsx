
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Smartphone } from 'lucide-react';
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
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    // Detect if the app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      setShowButton(false);
    } else {
      // Show button if not installed
      setShowButton(true);
    }

    // Capture the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent Chrome from automatically showing the prompt
      e.preventDefault();
      // Store the event for later use
      setInstallPrompt(e as BeforeInstallPromptEvent);
      setShowButton(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    // Detect when the app has been installed
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setInstallPrompt(null);
      setShowButton(false);
      toast({
        title: "¡Aplicación instalada!",
        description: "Workify SRCI se ha instalado correctamente en tu dispositivo."
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
          description: "1. Toca el botón 'Compartir' (cuadrado con flecha) en Safari\n2. Selecciona 'Añadir a pantalla de inicio'\n3. Confirma la instalación",
          duration: 10000,
        });
      } else {
        toast({
          title: "Instalar Workify SRCI",
          description: "Para instalar la app, usa el menú de tu navegador y busca 'Instalar aplicación' o 'Añadir a pantalla de inicio'",
          duration: 8000,
        });
      }
      return;
    }

    try {
      // Show the installation dialog
      await installPrompt.prompt();
      
      // Wait for the user's choice
      const choiceResult = await installPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the installation');
        toast({
          title: "¡Instalando!",
          description: "Workify SRCI se está instalando en tu dispositivo..."
        });
      } else {
        console.log('User dismissed the installation');
        toast({
          title: "Instalación cancelada",
          description: "Puedes instalar la app más tarde desde el menú del navegador"
        });
      }
      
      // Clear the saved prompt
      setInstallPrompt(null);
    } catch (error) {
      console.error('Error during installation:', error);
      toast({
        title: "Error al instalar",
        description: "Hubo un problema al instalar la aplicación. Inténtalo más tarde.",
        variant: "destructive"
      });
    }
  };

  // Show the button if not installed and we can potentially install
  if (isInstalled) {
    return null;
  }

  // Check if we're on a mobile device or have install capability
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window.MSStream);
  
  // Show button if we have install prompt, on mobile, or on iOS
  if (!showButton && !installPrompt && !isMobile && !isIOS) {
    return null;
  }

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={handleInstallClick}
      className="gap-2 bg-primary/10 hover:bg-primary/20 border-primary/20 text-primary hover:text-primary"
    >
      {isMobile ? <Smartphone className="h-4 w-4" /> : <Download className="h-4 w-4" />}
      <span className="hidden sm:inline">Instalar App</span>
      <span className="sm:hidden">Instalar</span>
    </Button>
  );
}
