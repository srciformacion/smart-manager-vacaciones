import { useState, useEffect } from "react";
import { User as AppUser } from "@/types";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth.tsx";

export const useProfileAuth = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [user, setUser] = useState<AppUser | null>(null);
  const navigate = useNavigate();
  const { user: authUser, userRole } = useAuth();

  const fetchAuthUser = async () => {
    try {
      // Check if we have an authenticated user from Supabase
      if (authUser) {
        setUserId(authUser.id);
        
        // Get additional profile data
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authUser.id)
          .single();
          
        if (profileError && profileError.code !== 'PGRST116') {
          console.error("Error fetching profile:", profileError);
        }
        
        setUser({
          id: authUser.id,
          name: profileData?.name || authUser.email?.split('@')[0] || "Usuario",
          surname: profileData?.surname || "",
          email: authUser.email || "",
          role: userRole === 'hr' ? 'hr' : 'worker',
          shift: 'Programado',
          workGroup: 'Grupo Programado',
          workday: 'Completa',
          department: profileData?.department || 'Administración',
          seniority: 0,
        });
        
        return authUser;
      }
      
      // If no authenticated user, check for demo user in localStorage
      const userJson = localStorage.getItem("user");
      
      if (!userJson) {
        toast({ 
          variant: "destructive",
          title: "Error de autenticación", 
          description: "Por favor inicia sesión para acceder a tu perfil." 
        });
        navigate("/auth");
        return null;
      }

      const userData = JSON.parse(userJson);
      const storedRole = localStorage.getItem('userRole') || 'worker';
      
      setUserId(userData.id);
      setUser({
        id: userData.id,
        name: userData.name || "Usuario",
        email: userData.email || "",
        role: storedRole === 'hr' ? 'hr' : 'worker',
        shift: 'Programado',
        workGroup: 'Grupo Programado',
        workday: 'Completa',
        department: 'Administración',
        seniority: 0,
      });

      return userData;
    } catch (error) {
      console.error("Error getting user info:", error);
      toast({ 
        variant: "destructive",
        title: "Error de autenticación", 
        description: "No se pudo obtener la información del usuario." 
      });
      navigate("/auth");
      return null;
    }
  };

  useEffect(() => {
    fetchAuthUser();
  }, [authUser]);

  return { userId, user, fetchAuthUser };
};
