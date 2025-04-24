
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@/types";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

export const useProfileAuth = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  const fetchAuthUser = async () => {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      toast({ 
        variant: "destructive",
        title: "Error de autenticación", 
        description: "Por favor inicia sesión para acceder a tu perfil." 
      });
      navigate("/login");
      return null;
    }

    setUserId(user.id);
    setUser({
      id: user.id,
      name: user.user_metadata?.name || "",
      email: user.email || "",
      role: 'worker',
      shift: 'Programado',
      workGroup: 'Grupo Programado',
      workday: 'Completa',
      department: 'Administración',
      seniority: 0,
    });

    return user;
  };

  return { userId, user, fetchAuthUser };
};
