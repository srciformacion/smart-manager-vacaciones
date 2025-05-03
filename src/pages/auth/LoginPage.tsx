
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LoginForm } from "@/components/auth/login-form";
import { UserRole } from "@/types";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Separator } from "@/components/ui/separator";

export default function LoginPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [userRole, setUserRole] = useState<UserRole>("worker");
  const navigate = useNavigate();

  // Comprobar si ya hay una sesión
  useEffect(() => {
    const storedRole = localStorage.getItem("userRole");
    if (storedRole) {
      navigate(storedRole === "hr" ? "/rrhh/dashboard" : "/dashboard");
    }
  }, [navigate]);

  const handleSubmit = async (values: { email: string; password: string }) => {
    setIsSubmitting(true);
    setError(undefined);

    try {
      // En una implementación real, usaríamos la autenticación de NocoDB
      // const response = await NocoDBAPI.loginUser(values.email, values.password);
      
      // Simulación para demostración
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Set the selected role
      localStorage.setItem("userRole", userRole);
      localStorage.setItem("userEmail", values.email);
      
      // Navigate based on selected role
      if (userRole === "hr") {
        navigate("/rrhh/dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Error de inicio de sesión:", err);
      setError("Credenciales incorrectas. Por favor, inténtelo de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-secondary/20 p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <div className="w-full max-w-md">
        <div className="mb-8 text-center animate-in fade-in-50 slide-in-from-top duration-500">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-lg">
              <span className="text-2xl font-bold text-primary-foreground">LC</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-primary">La Rioja Cuida</h1>
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
          />
        </div>
        
        <div className="mt-6 text-center animate-in fade-in-50 duration-500 delay-500">
          <Separator className="my-4" />
          <p className="text-sm text-muted-foreground mb-2">
            ¿Quieres probar la aplicación sin crear una cuenta?
          </p>
          <Button variant="outline" asChild className="transition-all duration-200 hover:bg-secondary">
            <Link to="/roles">Acceder con rol de demostración</Link>
          </Button>
          
          <div className="mt-6 text-xs text-muted-foreground">
            <p>Credenciales de prueba:</p>
            <p>Email: usuario@example.com | Contraseña: password</p>
          </div>
        </div>
      </div>
    </div>
  );
}
