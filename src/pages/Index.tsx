
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export default function Index() {
  const navigate = useNavigate();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      navigate("/dashboard");
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
