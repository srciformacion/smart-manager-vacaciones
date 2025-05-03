
import { useState, useEffect } from "react";
import { User as AppUser } from "@/types";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useProfileAuth = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [user, setUser] = useState<AppUser | null>(null);
  const navigate = useNavigate();

  const fetchAuthUser = async () => {
    try {
      // First try to get the user from Supabase
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Supabase auth error:", error);
        throw error;
      }
      
      if (session?.user) {
        const supabaseUser = session.user;
        setUserId(supabaseUser.id);
        
        // Get additional profile data
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', supabaseUser.id)
          .single();
          
        if (profileError && profileError.code !== 'PGRST116') {
          console.error("Error fetching profile:", profileError);
        }
        
        const userRole = localStorage.getItem('userRole') || 'worker';
        
        setUser({
          id: supabaseUser.id,
          name: profileData?.name || supabaseUser.email?.split('@')[0] || "Usuario",
          surname: profileData?.surname || "",
          email: supabaseUser.email || "",
          role: userRole === 'hr' ? 'hr' : 'worker',
          shift: 'Programado',
          workGroup: 'Grupo Programado',
          workday: 'Completa',
          department: profileData?.department || 'Administración',
          seniority: 0,
        });
        
        return supabaseUser;
      }
    } catch (error) {
      console.error("Error getting user from Supabase:", error);
      toast({ 
        variant: "destructive",
        title: "Error de autenticación", 
        description: "No se pudo obtener la información del usuario." 
      });
    }
    
    // If no user in Supabase, try to get from localStorage as fallback
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
    const userRole = localStorage.getItem('userRole') || 'worker';
    
    setUserId(userData.id);
    setUser({
      id: userData.id,
      name: userData.name || "Usuario",
      email: userData.email || "",
      role: userRole === 'hr' ? 'hr' : 'worker',
      shift: 'Programado',
      workGroup: 'Grupo Programado',
      workday: 'Completa',
      department: 'Administración',
      seniority: 0,
    });

    return userData;
  };

  return { userId, user, fetchAuthUser };
};
