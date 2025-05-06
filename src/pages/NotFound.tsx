
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userRole, user } = useAuth();

  useEffect(() => {
    console.error(
      "404 Error: Usuario intentó acceder a una ruta inexistente:",
      location.pathname
    );
    
    // Si el usuario ha cerrado sesión y se encuentra en una página 404, redirigir al login
    if (location.pathname.includes("undefined") || location.pathname.includes("null")) {
      navigate("/auth", { replace: true });
    }
  }, [location.pathname, navigate]);

  // Si no hay usuario autenticado, redirigir a la página de login
  if (!user && !localStorage.getItem("user")) {
    return <Navigate to="/auth" replace />;
  }

  // Función para determinar la ruta del dashboard según el rol
  const getDashboardRoute = () => {
    return userRole === 'hr' ? "/rrhh/dashboard" : "/dashboard";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center max-w-lg px-4">
        <h1 className="text-6xl font-bold mb-6 text-primary">404</h1>
        <p className="text-2xl font-medium mb-2">Página no encontrada</p>
        <p className="text-muted-foreground mb-8">
          Lo sentimos, la página que estás buscando no existe o ha sido movida.
        </p>
        <div className="flex justify-center">
          <Button onClick={() => navigate(getDashboardRoute())}>
            Ir al dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
