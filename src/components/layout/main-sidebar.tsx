
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

  return (
    <aside className="hidden lg:block w-64 border-r border-sidebar-border bg-sidebar">
      <SidebarNavigation 
        // Cast user to the correct User type from our application
        user={user as unknown as User} 
        onLogout={handleLogout}
      />
    </aside>
  );
}
