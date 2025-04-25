
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: Usuario intentó acceder a una ruta inexistente:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center max-w-lg px-4">
        <h1 className="text-6xl font-bold mb-6 text-primary">404</h1>
        <p className="text-2xl font-medium mb-2">Página no encontrada</p>
        <p className="text-muted-foreground mb-8">
          Lo sentimos, la página que estás buscando no existe o ha sido movida.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={() => window.history.back()} variant="outline">
            Volver atrás
          </Button>
          <Button asChild>
            <Link to="/dashboard">Ir al dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
