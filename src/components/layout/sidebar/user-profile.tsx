
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, UserRole } from "@/types";
import { CircleUser, LogOut } from "lucide-react";
import { NavLink } from "react-router-dom";

interface UserProfileProps {
  user: User | null;
  role: UserRole;
  collapsed: boolean;
  onLogout?: () => Promise<void>;
  onNavigate?: () => void;
}

export function UserProfile({ user, role, collapsed, onLogout, onNavigate }: UserProfileProps) {
  // Extract initial for avatar fallback
  const getInitial = () => {
    if (user?.name) {
      return user.name.charAt(0).toUpperCase();
    }
    return "U";
  };

  if (!user) return null;

  return (
    <div className={cn(
      "mt-auto border-t border-sidebar-border p-4",
      collapsed ? "flex justify-center" : ""
    )}>
      <div className={cn(
        collapsed ? "" : "flex items-center gap-3 mb-4"
      )}>
        {!collapsed ? (
          <>
            <Avatar>
              <AvatarImage src={user.profilePicture} alt={`${user.name}`} />
              <AvatarFallback>{getInitial()}</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <p className="text-sm font-medium text-sidebar-foreground">{user.name}</p>
              <p className="text-xs text-sidebar-foreground/70">{user.email}</p>
              <p className="text-xs font-medium bg-sidebar-primary/20 text-sidebar-foreground inline-block px-2 py-0.5 rounded-full">
                {role === "hr" ? "RRHH" : "Trabajador"}
              </p>
            </div>
          </>
        ) : (
          <Avatar>
            <AvatarImage src={user.profilePicture} alt={`${user.name}`} />
            <AvatarFallback>{getInitial()}</AvatarFallback>
          </Avatar>
        )}
      </div>
      
      {!collapsed && (
        <div className="flex items-center gap-2">
          <NavLink
            to="/profile"
            className={({ isActive }) => cn(
              "w-full flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground"
            )}
            onClick={onNavigate}
          >
            <CircleUser className="h-4 w-4" />
            Mi Perfil
          </NavLink>
        </div>
      )}
      
      {onLogout && (
        <Button 
          variant="outline" 
          className={cn("w-full mt-2 border-sidebar-border bg-transparent text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground", collapsed && "p-2")} 
          onClick={onLogout}
          aria-label="Cerrar sesión"
        >
          <LogOut className={cn("h-4 w-4", collapsed && "mr-0")} aria-hidden="true" />
          {!collapsed && <span className="ml-2">Cerrar sesión</span>}
        </Button>
      )}
    </div>
  );
}
