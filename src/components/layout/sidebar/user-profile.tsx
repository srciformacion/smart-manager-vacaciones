
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, UserRole } from "@/types";
import { CircleUser, LogOut } from "lucide-react";
import { NavLink } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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

  const handleLogout = async () => {
    try {
      console.log("UserProfile - Attempting logout");
      if (onLogout) {
        await onLogout();
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  if (!user) return null;

  return (
    <TooltipProvider>
      <div className={cn(
        "border-t border-sidebar-border p-2",
        collapsed ? "flex flex-col items-center space-y-1" : "space-y-2"
      )}>
        {/* User Info Section */}
        <div className={cn(
          collapsed ? "flex flex-col items-center space-y-1" : "flex items-center gap-2"
        )}>
          <Avatar className={collapsed ? "w-6 h-6" : "w-8 h-8"}>
            <AvatarImage src={user.profilePicture} alt={`${user.name}`} />
            <AvatarFallback className="text-xs">{getInitial()}</AvatarFallback>
          </Avatar>
          
          {!collapsed && (
            <div className="space-y-0.5 min-w-0 flex-1">
              <p className="text-xs font-medium text-sidebar-foreground truncate">{user.name}</p>
              <p className="text-xs text-sidebar-foreground/70 truncate">{user.email}</p>
              <p className="text-xs font-medium bg-sidebar-primary/20 text-sidebar-foreground inline-block px-1.5 py-0.5 rounded-full">
                {role === "hr" ? "RRHH" : "Trabajador"}
              </p>
            </div>
          )}
        </div>
        
        {/* Action Buttons */}
        <div className={cn(
          "flex",
          collapsed ? "flex-col space-y-1" : "gap-1"
        )}>
          {/* Profile Link */}
          {collapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <NavLink
                  to="/profile"
                  className={({ isActive }) => cn(
                    "flex items-center justify-center rounded-lg p-1.5 h-6 w-6 text-sm transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground"
                  )}
                  onClick={onNavigate}
                >
                  <CircleUser className="h-3 w-3" />
                </NavLink>
              </TooltipTrigger>
              <TooltipContent side="right" className="ml-2">
                Mi Perfil
              </TooltipContent>
            </Tooltip>
          ) : (
            <NavLink
              to="/profile"
              className={({ isActive }) => cn(
                "flex items-center gap-2 rounded-lg px-2 py-1 text-xs transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex-1",
                isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground"
              )}
              onClick={onNavigate}
            >
              <CircleUser className="h-3 w-3" />
              Mi Perfil
            </NavLink>
          )}
          
          {/* Logout Button */}
          {onLogout && (
            collapsed ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="icon"
                    className="border-sidebar-border bg-transparent text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground h-6 w-6 p-0" 
                    onClick={handleLogout}
                    aria-label="Cerrar sesión"
                  >
                    <LogOut className="h-3 w-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right" className="ml-2">
                  Cerrar sesión
                </TooltipContent>
              </Tooltip>
            ) : (
              <Button 
                variant="outline" 
                size="sm"
                className="border-sidebar-border bg-transparent text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-xs py-1 h-auto flex-1" 
                onClick={handleLogout}
                aria-label="Cerrar sesión"
              >
                <LogOut className="h-3 w-3 mr-1" />
                Cerrar sesión
              </Button>
            )
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}
