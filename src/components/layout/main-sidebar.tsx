
import { SidebarNavigation } from "./sidebar-navigation";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/auth";
import { User, UserRole } from "@/types";

export function MainSidebar() {
  const { user, signOut, userRole } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    await signOut();
    navigate("/auth", { replace: true });
  };

  // Convert the user object to our User type or use null
  const typedUser = user ? {
    id: user.id,
    name: user.user_metadata?.name || "Usuario",
    email: user.email || "",
    role: userRole as UserRole || (user.user_metadata?.role as UserRole) || "worker",
  } as User : null;

  // Default role to 'worker' if nothing is available
  const effectiveRole = userRole as UserRole || (user?.user_metadata?.role as UserRole) || localStorage.getItem("userRole") as UserRole || "worker";

  // Función para manejar la navegación y cerrar el menú mobile si es necesario
  const handleNavigation = () => {
    // Esta función será implementada por el componente padre que utilice MainSidebar
    // para cerrar el menú en dispositivos móviles cuando se navega
  };

  return (
    <aside className="h-full border-r border-sidebar-border bg-sidebar">
      <SidebarNavigation 
        user={typedUser}
        role={effectiveRole}
        onLogout={handleLogout}
        onNavigate={handleNavigation}
      />
    </aside>
  );
}
