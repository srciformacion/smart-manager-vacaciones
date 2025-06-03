import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { UserRole } from "@/types";
import { InstallPWAButton } from "@/components/pwa/install-pwa-button";
import { Smartphone, Download } from "lucide-react";

export default function Index() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [checking, setChecking] = useState(true);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    checkUser();
    // Check if app is installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }
  }, []);

  const checkUser = () => {
    setChecking(true);
    try {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const userData = JSON.parse(userStr);
        const userRole = localStorage.getItem("userRole") as UserRole || userData.role as UserRole;
        console.log("Found user in storage with role:", userRole);
        if (userRole === "hr") {
          navigate("/rrhh/dashboard");
        } else {
          navigate("/dashboard");
        }
      } else {
        console.log("No user found in storage");
        setChecking(false);
      }
    } catch (error) {
      console.error("Error checking user:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Hubo un problema al verificar el usuario"
      });
      setChecking(false);
    }
  };

  const handleDemoLoginWorker = () => {
    const demoUser = {
      id: "demo-worker-id",
      email: "worker@demo.com",
      name: "Demo Worker",
      role: "worker"
    };
    localStorage.setItem("user", JSON.stringify(demoUser));
    localStorage.setItem("userRole", "worker");
    navigate("/dashboard");
    toast({
      title: "Sesión de demostración iniciada",
      description: "Has iniciado sesión como trabajador en modo demostración"
    });
  };

  const handleDemoLoginHR = () => {
    const demoUser = {
      id: "demo-hr-id",
      email: "hr@demo.com",
      name: "Demo HR",
      role: "hr"
    };
    localStorage.setItem("user", JSON.stringify(demoUser));
    localStorage.setItem("userRole", "hr");
    navigate("/rrhh/dashboard");
    toast({
      title: "Sesión de demostración iniciada",
      description: "Has iniciado sesión como personal de RRHH en modo demostración"
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md text-center space-y-8">
        {/* App Header */}
        <div>
          <h1 className="text-4xl font-bold text-primary">Workify SRCI</h1>
          <p className="text-xl text-muted-foreground mt-4">Sistema de Gestión Inteligente de Horarios</p>
        </div>

        {/* Install App Section - Only show if not installed */}
        {!isInstalled && (
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-center gap-2 text-primary">
              <Smartphone className="h-5 w-5" />
              <span className="font-semibold">¡Instala la App!</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Accede más rápido y úsala sin conexión instalándola en tu dispositivo
            </p>
            <InstallPWAButton />
          </div>
        )}
        
        {/* Main Actions */}
        <div className="space-y-4">
          <Button onClick={() => navigate("/auth")} size="lg" className="w-full">
            Iniciar sesión
          </Button>
          
          <div className="relative flex items-center py-4">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink mx-4 text-gray-400 text-sm">o probar el demo</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>
          
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <Button onClick={handleDemoLoginWorker} variant="outline" className="flex-1">
              Demo Trabajador
            </Button>
            <Button onClick={handleDemoLoginHR} variant="outline" className="flex-1">
              Demo RRHH
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
