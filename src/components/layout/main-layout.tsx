
import { ReactNode, useState } from "react";
import { SidebarNavigation } from "./sidebar-navigation";
import { User, UserRole } from "@/types";
import { cn } from "@/lib/utils";

interface MainLayoutProps {
  children: ReactNode;
  user?: User | null;
  className?: string;
}

export function MainLayout({ children, user, className }: MainLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  
  // Maneja cierre de sesión
  const handleLogout = () => {
    // Implementar lógica real de cierre de sesión aquí
    console.log("Logout");
    // Redireccionar a la página de login
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen flex bg-background">
      {user && (
        <SidebarNavigation 
          userRole={user.role as UserRole} 
          onLogout={handleLogout} 
        />
      )}
      
      <main
        className={cn(
          "flex-1 p-6 transition-all duration-300 ease-in-out",
          user ? "lg:ml-64" : "",
          className
        )}
      >
        {children}
      </main>
    </div>
  );
}
