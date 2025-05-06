
import { useAuth } from "@/hooks/auth";
import { User } from "@/types";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useProfileAuth() {
  const { user: authUser, userRole } = useAuth();
  const [loading, setLoading] = useState(false);
  
  // Convert auth user to app User type
  const user: User | null = authUser ? {
    id: authUser.id,
    name: authUser.user_metadata?.name || authUser.name || "Usuario",
    email: authUser.email || "",
    role: userRole || authUser.user_metadata?.role || authUser.role || "worker",
  } : null;
  
  // Add userId property for convenience
  const userId = user?.id || null;
  
  // Add fetchAuthUser function
  const fetchAuthUser = async () => {
    setLoading(true);
    try {
      // Try to get session from Supabase
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        // Check localStorage for demo purposes
        const demoUser = localStorage.getItem("user");
        if (demoUser) {
          return JSON.parse(demoUser);
        }
        return null;
      }
      return session.user;
    } catch (error) {
      console.error("Error fetching auth user:", error);
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  return { 
    user, 
    userId, 
    fetchAuthUser,
    loading
  };
}
