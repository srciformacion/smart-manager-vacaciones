
import { SidebarNavigation } from "./sidebar-navigation";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { User } from "@/types";

export function MainSidebar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  // Asegúrate de que el usuario sea del tipo correcto
  const typedUser = user as User;

  return (
    <aside className="hidden lg:block w-64 border-r border-sidebar-border bg-sidebar">
      <SidebarNavigation 
        user={typedUser}
        onLogout={handleLogout}
      />
    </aside>
  );
}
