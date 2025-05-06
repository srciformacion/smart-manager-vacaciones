
import {
  CalendarCheck,
  CalendarDays,
  ChevronsLeft,
  CircleUser,
  FilePen,
  Home,
  LogOut,
  MessageSquare,
  Settings,
  User,
} from "lucide-react";
import { NavLink, NavLinkProps } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User as UserType, UserRole } from "@/types";

const userLinks = [
  { name: "Dashboard", href: "/", icon: Home, ariaLabel: "Ir a Dashboard" },
  { name: "Mi Calendario", href: "/calendar", icon: CalendarDays, ariaLabel: "Ir a Mi Calendario" },
  { name: "Solicitudes", href: "/requests", icon: FilePen, ariaLabel: "Ir a Solicitudes" },
  { name: "Chat", href: "/chat", icon: MessageSquare, ariaLabel: "Ir a Chat" },
  { name: "Perfil", href: "/profile", icon: User, ariaLabel: "Ir a Perfil" },
];

const adminLinks = [
  { name: "Dashboard", href: "/hr", icon: Home, ariaLabel: "Ir a Dashboard" },
  { name: "Calendarios", href: "/hr/calendar", icon: CalendarCheck, ariaLabel: "Ir a Gestión de Calendarios" },
  { name: "Solicitudes", href: "/hr/requests", icon: FilePen, ariaLabel: "Ir a Gestión de Solicitudes" },
  { name: "Personal", href: "/hr/workers", icon: User, ariaLabel: "Ir a Gestión de Personal" },
  { name: "Chat", href: "/chat", icon: MessageSquare, ariaLabel: "Ir a Chat" },
  { name: "Asistente IA", href: "/hr/ai", icon: Settings, ariaLabel: "Ir a Asistente IA" },
  { name: "Notificaciones", href: "/hr/notifications", icon: Settings, ariaLabel: "Ir a Notificaciones" }
];

interface SidebarNavigationProps {
  user: UserType | null;
  role?: UserRole;
  collapsed?: boolean;
  onLogout?: () => Promise<void>;
  onNavigate?: () => void;
  onClose?: () => void;
  onCollapse?: () => void;
}

export function SidebarNavigation({
  user,
  role = "worker",
  collapsed = false,
  onLogout,
  onNavigate,
  onClose,
  onCollapse,
}: SidebarNavigationProps) {
  const links = role === "hr" ? adminLinks : userLinks;
  
  // Extract initial for avatar fallback
  const getInitial = () => {
    if (user?.name) {
      return user.name.charAt(0).toUpperCase();
    }
    return "U";
  };

  const handleNavigation = () => {
    if (onNavigate) onNavigate();
    if (onClose) onClose();
  };

  const handleLogout = async () => {
    if (onLogout) await onLogout();
  };

  return (
    <div className="h-full flex flex-col bg-background border-r">
      <div className={cn(
        "flex h-14 items-center border-b px-4",
        collapsed ? "justify-center" : "justify-between"
      )}>
        {!collapsed && <span className="text-lg font-bold">TurnoSync</span>}
        {onCollapse && (
          <Button variant="ghost" size="icon" onClick={onCollapse} aria-label="Colapsar menú">
            <ChevronsLeft className="h-4 w-4" />
            <span className="sr-only">Colapsar menú</span>
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 gap-1">
          {links.map((link) => (
            <NavLink
              key={link.href}
              to={link.href}
              className={(props) => cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-accent hover:text-accent-foreground",
                props.isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                collapsed && "justify-center p-0 h-9 w-9",
              )}
              onClick={handleNavigation}
              aria-label={link.ariaLabel}
            >
              <link.icon className={cn("h-4 w-4", collapsed ? "h-5 w-5" : "")} aria-hidden="true" />
              {!collapsed && <span>{link.name}</span>}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className={cn(
        "mt-auto border-t p-4",
        collapsed ? "flex justify-center" : ""
      )}>
        {user && (
          <div className={cn(
            collapsed ? "" : "flex items-center gap-3 mb-4"
          )}>
            {!collapsed ? (
              <>
                <Avatar>
                  <AvatarImage src={user.avatar} alt={`${user.name}`} />
                  <AvatarFallback>{getInitial()}</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </>
            ) : (
              <Avatar>
                <AvatarImage src={user.avatar} alt={`${user.name}`} />
                <AvatarFallback>{getInitial()}</AvatarFallback>
              </Avatar>
            )}
          </div>
        )}
        
        {!collapsed && (
          <div className="flex items-center gap-2">
            <NavLink
              to="/profile"
              className={({ isActive }) => cn(
                "w-full flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent hover:text-accent-foreground",
                isActive ? "bg-accent text-accent-foreground" : ""
              )}
              onClick={handleNavigation}
            >
              <CircleUser className="h-4 w-4" />
              Mi Perfil
            </NavLink>
          </div>
        )}
        
        {onLogout && (
          <Button 
            variant="outline" 
            className={cn("w-full mt-2", collapsed && "p-2")} 
            onClick={handleLogout}
            aria-label="Cerrar sesión"
          >
            <LogOut className={cn("h-4 w-4", collapsed && "mr-0")} aria-hidden="true" />
            {!collapsed && <span className="ml-2">Cerrar sesión</span>}
          </Button>
        )}
      </div>
    </div>
  );
}
