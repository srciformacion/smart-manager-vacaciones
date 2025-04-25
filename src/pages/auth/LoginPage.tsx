
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoginForm } from "@/components/auth/login-form";
import { UserRole } from "@/types";
import NocoDBAPI from "@/utils/nocodbApi";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [userRole, setUserRole] = useState<UserRole>("worker");
  const navigate = useNavigate();

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
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <img
            src="/placeholder.svg"
            alt="VacaySmart Logo"
            className="mx-auto h-12 w-auto mb-4"
          />
          <h1 className="text-3xl font-bold text-primary">VacaySmart</h1>
          <p className="mt-2 text-muted-foreground">
            Sistema inteligente de gestión de vacaciones y permisos
          </p>
        </div>
        
        <div className="mb-6">
          <Label className="text-center block mb-2">Seleccione su rol</Label>
          <RadioGroup 
            value={userRole} 
            onValueChange={(value) => setUserRole(value as UserRole)}
            className="flex justify-center space-x-8"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="worker" id="worker" />
              <Label htmlFor="worker">Trabajador</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="hr" id="hr" />
              <Label htmlFor="hr">RRHH</Label>
            </div>
          </RadioGroup>
        </div>
        
        <LoginForm
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          error={error}
        />
        
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground mb-2">
            ¿Quieres probar la aplicación sin crear una cuenta?
          </p>
          <Button variant="outline" asChild>
            <Link to="/roles">Acceder con rol de demostración</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
