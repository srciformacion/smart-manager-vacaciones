
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { UserRole } from "@/types";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Separator } from "@/components/ui/separator";
import { LoginForm } from "@/components/auth/login-form";
import { toast } from "sonner";
import { useAuth } from "@/hooks/auth";

export default function LoginPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [mode, setMode] = useState<"login" | "register">("login");
  const navigate = useNavigate();
  const { user, signIn, signUp, userRole, setUserRole } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      if (userRole === 'hr') {
        navigate('/rrhh/dashboard');
      } else {
        navigate('/dashboard');
      }
    }
  }, [user, userRole, navigate]);

  const toggleMode = () => {
    setMode(mode === "login" ? "register" : "login");
    setError(undefined);
  };

  const handleSubmit = async (values: { email: string; password: string }) => {
    setIsSubmitting(true);
    setError(undefined);

    try {
      if (mode === "login") {
        await signIn(values.email, values.password);
      } else {
        await signUp(values.email, values.password, {
          name: "",
          surname: "",
          role: userRole,
        });
        
        setMode("login");
        setIsSubmitting(false);
        return;
      }
    } catch (err) {
      console.error("Error de autenticación:", err);
      setError(err instanceof Error ? err.message : "Credenciales incorrectas. Por favor, inténtelo de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to handle demo login
  const handleDemoLogin = () => {
    // Create a default user object for localStorage with more detailed information
    const userData = {
      id: `demo-${Date.now().toString()}`,
      name: userRole === "hr" ? "Administrador RRHH" : "Usuario Demo",
      email: "demo@example.com",
      role: userRole,
      // Add additional fields that might be expected by the application
      department: userRole === "hr" ? "Recursos Humanos" : "General",
    };
    
    // Clear any previous data to avoid conflicts
    localStorage.removeItem("user");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    
    // Set new data
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("userRole", userRole);
    localStorage.setItem("userEmail", "demo@example.com");
    
    console.log("Demo login - Setting role:", userRole);
    console.log("Demo user data:", userData);
    
    toast("Acceso en modo demo", {
      description: `Has accedido como ${userRole === "hr" ? "RRHH" : "Trabajador"} en modo demostración`,
    });
    
    // Add a slight delay to ensure localStorage is updated
    setTimeout(() => {
      // Navigate based on selected role with replace:true to prevent going back
      if (userRole === "hr") {
        console.log("Navigating to RRHH dashboard");
        navigate("/rrhh/dashboard", { replace: true });
      } else {
        console.log("Navigating to worker dashboard");
        navigate("/dashboard", { replace: true });
      }
    }, 100);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-secondary/20 p-4">
      <div className="absolute top-4 right-4 flex gap-2">
        <ThemeToggle />
      </div>
      
      <div className="w-full max-w-md">
        <div className="mb-8 text-center animate-in fade-in-50 slide-in-from-top duration-500">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-lg">
              <span className="text-2xl font-bold text-primary-foreground">SV</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-primary">Smart Vacancy</h1>
          <p className="mt-2 text-muted-foreground">
            Sistema inteligente de gestión de vacaciones y permisos
          </p>
        </div>
        
        <div className="mb-6 animate-in fade-in-50 slide-in-from-bottom duration-500 delay-200">
          <Label className="text-center block mb-2">Seleccione su rol</Label>
          <RadioGroup 
            value={userRole} 
            onValueChange={(value) => setUserRole(value as UserRole)}
            className="grid grid-cols-2 gap-4"
          >
            <div className="flex items-center justify-center space-x-2 bg-secondary/50 rounded-lg p-3 cursor-pointer hover:bg-secondary transition-colors duration-200" 
                onClick={() => setUserRole("worker")}>
              <RadioGroupItem value="worker" id="worker" />
              <Label htmlFor="worker" className="cursor-pointer font-medium">Trabajador</Label>
            </div>
            <div className="flex items-center justify-center space-x-2 bg-secondary/50 rounded-lg p-3 cursor-pointer hover:bg-secondary transition-colors duration-200"
                onClick={() => setUserRole("hr")}>
              <RadioGroupItem value="hr" id="hr" />
              <Label htmlFor="hr" className="cursor-pointer font-medium">RRHH</Label>
            </div>
          </RadioGroup>
        </div>
        
        <div className="animate-in fade-in-50 slide-in-from-bottom duration-500 delay-300">
          <LoginForm
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            error={error}
            mode={mode}
            onToggleMode={toggleMode}
          />
        </div>
        
        <div className="mt-6 text-center animate-in fade-in-50 duration-500 delay-500">
          <Separator className="my-4" />
          <p className="text-sm text-muted-foreground mb-2">
            ¿Quieres probar la aplicación sin crear una cuenta?
          </p>
          <Button variant="outline" onClick={handleDemoLogin} className="transition-all duration-200 hover:bg-secondary">
            Acceder con rol de demostración
          </Button>
          
          <div className="mt-6 text-xs text-muted-foreground">
            <p>Credenciales de prueba:</p>
            <p>Email: rrhh@example.com | Contraseña: password</p>
          </div>
        </div>
        
        <div className="mt-4 text-xs text-center text-muted-foreground">
          <p>Versión 1.0.0 • Smart Vacancy © 2025</p>
        </div>
      </div>
    </div>
  );
}
