
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Index() {
  const navigate = useNavigate();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = () => {
    const user = localStorage.getItem("user");
    if (user) {
      const userRole = localStorage.getItem("userRole");
      if (userRole === "hr") {
        navigate("/rrhh/dashboard");
      } else {
        navigate("/dashboard");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-primary mb-8">La Rioja Cuida</h1>
        <p className="text-muted-foreground mb-8">
          Sistema de gestión de vacaciones y permisos
        </p>
        <Button onClick={() => navigate("/auth")} size="lg">
          Comenzar
        </Button>
      </div>
    </div>
  );
}
