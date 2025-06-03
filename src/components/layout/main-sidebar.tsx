
import { useState } from "react";
import { SidebarNavigation } from "./sidebar-navigation";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/auth";
import { User, UserRole } from "@/types";
import { useToast } from "@/components/ui/use-toast";

interface MainSidebarProps {
  onNavigate?: () => void;
  collapsed?: boolean;
  onCollapse?: () => void;
}

export function MainSidebar({ onNavigate, collapsed = false, onCollapse }: MainSidebarProps) {
  const { user, signOut, userRole } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleLogout = async () => {
    try {
      await signOut();
      // Clear any local storage data related to the user
      localStorage.removeItem("user");
      localStorage.removeItem("userRole");
      
      navigate("/auth", { replace: true });
      if (onNavigate) {
        onNavigate();
      }
    } catch (error) {
      console.error("Error during logout:", error);
      toast({
        variant: "destructive",
        title: "Error al cerrar sesión",
        description: "No se pudo cerrar la sesión correctamente"
      });
    }
  };

  // First try to get user from auth context
  let typedUser: User | null = null;
  let effectiveRole: UserRole = "worker";

  // If we have user data from auth context
  if (user) {
    typedUser = {
      id: user.id || "demo-user",
      name: user.user_metadata?.name || user.email?.split('@')[0] || "Usuario",
      email: user.email || "",
      role: userRole as UserRole || (user.user_metadata?.role as UserRole) || "worker",
      profilePicture: user.user_metadata?.avatar_url || ""
    };
    effectiveRole = userRole as UserRole || (user.user_metadata?.role as UserRole) || "worker";
  } 
  // If no user in auth context, try localStorage (for demo users)
  else {
    const storedUserData = localStorage.getItem("user");
    if (storedUserData) {
      try {
        const parsedUser = JSON.parse(storedUserData);
        typedUser = {
          id: parsedUser.id || "demo-user",
          name: parsedUser.name || "Usuario",
          email: parsedUser.email || "",
          role: parsedUser.role || "worker",
          profilePicture: parsedUser.profilePicture || ""
        };
        // Get role from localStorage or default to what's in the user object
        effectiveRole = (localStorage.getItem("userRole") as UserRole) || parsedUser.role || "worker";
      } catch (e) {
        console.error("Error parsing stored user data:", e);
      }
    }
  }

  console.log("MainSidebar - User:", typedUser);
  console.log("MainSidebar - Role:", effectiveRole);
  
  // Handle navigation and close the mobile menu if needed
  const handleNavigation = () => {
    if (onNavigate) {
      onNavigate();
    }
  };

  return (
    <aside 
      className={cn(
        "h-full border-r border-sidebar-border bg-sidebar transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )} 
      role="navigation" 
      aria-label="Menú principal"
    >
      <SidebarNavigation 
        user={typedUser}
        role={effectiveRole}
        collapsed={collapsed}
        onLogout={handleLogout}
        onNavigate={handleNavigation}
        onCollapse={onCollapse}
      />
    </aside>
  );
}
