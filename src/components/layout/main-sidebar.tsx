
import { SidebarNavigation } from "./sidebar-navigation";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/auth";
import { User, UserRole } from "@/types";

interface MainSidebarProps {
  onNavigate?: () => void;
}

export function MainSidebar({ onNavigate }: MainSidebarProps) {
  const { user, signOut, userRole } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    await signOut();
    navigate("/auth", { replace: true });
    if (onNavigate) {
      onNavigate();
    }
  };

  // Convert the user object to our User type or use null
  const typedUser = user ? {
    id: user.id,
    name: user.user_metadata?.name || user.email?.split('@')[0] || "Usuario",
    email: user.email || "",
    role: userRole as UserRole || (user.user_metadata?.role as UserRole) || "worker",
  } as User : null;

  // Default role to 'worker' if nothing is available
  const effectiveRole = userRole as UserRole || (user?.user_metadata?.role as UserRole) || localStorage.getItem("userRole") as UserRole || "worker";

  // Handle navigation and close the mobile menu if needed
  const handleNavigation = () => {
    if (onNavigate) {
      onNavigate();
    }
  };

  return (
    <aside className="h-full border-r border-sidebar-border bg-sidebar" role="navigation" aria-label="Menú principal">
      <SidebarNavigation 
        user={typedUser}
        role={effectiveRole}
        onLogout={handleLogout}
        onNavigate={handleNavigation}
      />
    </aside>
  );
}
