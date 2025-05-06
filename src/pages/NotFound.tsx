
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userRole } = useAuth();

  useEffect(() => {
    console.error(
      "404 Error: Usuario intentó acceder a una ruta inexistente:",
      location.pathname
    );
  }, [location.pathname]);

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
          <Button asChild>
            <Button onClick={() => navigate(getDashboardRoute())}>Ir al dashboard</Button>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
