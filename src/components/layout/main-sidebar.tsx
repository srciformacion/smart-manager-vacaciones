
import { SidebarNavigation } from "./sidebar-navigation";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";

export function MainSidebar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <aside className="hidden lg:block w-64 border-r bg-background">
      <SidebarNavigation 
        user={user} 
        onLogout={handleLogout}
      />
    </aside>
  );
}
