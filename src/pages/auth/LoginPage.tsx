
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoginForm } from "@/components/auth/login-form";
import { UserRole } from "@/types";
import NocoDBAPI from "@/utils/nocodbApi";

export default function LoginPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const navigate = useNavigate();

  const handleSubmit = async (values: { email: string; password: string }) => {
    setIsSubmitting(true);
    setError(undefined);

    try {
      // En una implementación real, usaríamos la autenticación de NocoDB
      // const response = await NocoDBAPI.loginUser(values.email, values.password);
      
      // Simulación para demostración
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulamos un usuario de ejemplo según el email
      if (values.email.includes("hr") || values.email.includes("rrhh")) {
        // Usuario de RRHH
        localStorage.setItem("userRole", "hr");
        localStorage.setItem("userEmail", values.email);
        navigate("/rrhh/dashboard");
      } else {
        // Usuario trabajador
        localStorage.setItem("userRole", "worker");
        localStorage.setItem("userEmail", values.email);
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
        
        <LoginForm
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          error={error}
        />
      </div>
    </div>
  );
}
