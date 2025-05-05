
import { SidebarNavigation } from "./sidebar-navigation";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/auth";
import { User } from "@/types";

export function MainSidebar() {
  const { user, signOut } = useAuth();
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
    role: (user.user_metadata?.role || localStorage.getItem("userRole") || "worker") as "worker" | "hr",
  } as User : null;

  // Debug log to see what's being passed to SidebarNavigation
  console.log("MainSidebar - User:", typedUser);
  console.log("MainSidebar - Role from localStorage:", localStorage.getItem("userRole"));

  return (
    <aside className="hidden lg:block w-64 border-r border-sidebar-border bg-sidebar">
      <SidebarNavigation 
        user={typedUser}
        role={localStorage.getItem("userRole") as "worker" | "hr"} 
        onLogout={handleLogout}
      />
    </aside>
  );
}
