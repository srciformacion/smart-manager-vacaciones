
import { useState, useEffect } from "react";
import { User } from "@/types";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

export const useProfileAuth = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  const fetchAuthUser = async () => {
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
