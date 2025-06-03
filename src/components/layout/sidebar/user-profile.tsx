
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

  if (!user) return null;

  return (
    <TooltipProvider>
      <div className={cn(
        "mt-auto border-t border-sidebar-border p-4",
        collapsed ? "flex flex-col items-center space-y-2" : ""
      )}>
        <div className={cn(
          collapsed ? "flex flex-col items-center space-y-2" : "flex items-center gap-3 mb-4"
        )}>
          <Avatar className={collapsed ? "w-8 h-8" : "w-10 h-10"}>
            <AvatarImage src={user.profilePicture} alt={`${user.name}`} />
            <AvatarFallback>{getInitial()}</AvatarFallback>
          </Avatar>
          
          {!collapsed && (
            <div className="space-y-1">
              <p className="text-sm font-medium text-sidebar-foreground">{user.name}</p>
              <p className="text-xs text-sidebar-foreground/70">{user.email}</p>
              <p className="text-xs font-medium bg-sidebar-primary/20 text-sidebar-foreground inline-block px-2 py-0.5 rounded-full">
                {role === "hr" ? "RRHH" : "Trabajador"}
              </p>
            </div>
          )}
        </div>
        
        {/* Profile Link */}
        <div className={cn("flex items-center", collapsed ? "justify-center" : "gap-2")}>
          {collapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <NavLink
                  to="/profile"
                  className={({ isActive }) => cn(
                    "flex items-center justify-center rounded-lg p-2 h-10 w-10 text-sm transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground"
                  )}
                  onClick={onNavigate}
                >
                  <CircleUser className="h-4 w-4" />
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
                "w-full flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground"
              )}
              onClick={onNavigate}
            >
              <CircleUser className="h-4 w-4" />
              Mi Perfil
            </NavLink>
          )}
        </div>
        
        {/* Logout Button */}
        {onLogout && (
          collapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon"
                  className="border-sidebar-border bg-transparent text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground w-10 h-10" 
                  onClick={onLogout}
                  aria-label="Cerrar sesión"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" className="ml-2">
                Cerrar sesión
              </TooltipContent>
            </Tooltip>
          ) : (
            <Button 
              variant="outline" 
              className="w-full mt-2 border-sidebar-border bg-transparent text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" 
              onClick={onLogout}
              aria-label="Cerrar sesión"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Cerrar sesión
            </Button>
          )
        )}
      </div>
    </TooltipProvider>
  );
}
