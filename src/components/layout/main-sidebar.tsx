
import { SidebarNavigation } from "./sidebar-navigation";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/auth";
import { User, UserRole } from "@/types";

export function MainSidebar() {
  const { user, signOut, userRole } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    await signOut();
    navigate("/login");
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

  console.log("MainSidebar - User:", typedUser);
  console.log("MainSidebar - Role:", effectiveRole);

  return (
    <aside className="hidden lg:block w-64 border-r border-sidebar-border bg-sidebar">
      <SidebarNavigation 
        user={typedUser}
        role={effectiveRole}
        onLogout={handleLogout}
      />
    </aside>
  );
}
