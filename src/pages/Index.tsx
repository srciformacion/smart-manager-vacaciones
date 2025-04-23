
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LoginForm } from "@/components/auth/login-form";

export default function Index() {
  const navigate = useNavigate();

  // Verificar si hay una sesión activa
  useEffect(() => {
    const userRole = localStorage.getItem("userRole");
    const userEmail = localStorage.getItem("userEmail");
    
    if (userRole && userEmail) {
      // Redirigir según rol
      if (userRole === "hr") {
        navigate("/rrhh/dashboard");
      } else {
        navigate("/dashboard");
      }
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <img
            src="/placeholder.svg"
            alt="Vacaciones y Permisos Logo"
            className="mx-auto h-12 w-auto mb-4"
          />
          <h1 className="text-3xl font-bold text-primary">Vacaciones y Permisos</h1>
          <p className="mt-2 text-muted-foreground">
            Sistema inteligente de gestión de vacaciones y permisos
          </p>
        </div>
        
        <LoginForm
          onSubmit={(values) => {
            // Simulación de inicio de sesión
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
          }}
        />
      </div>
    </div>
  );
}
