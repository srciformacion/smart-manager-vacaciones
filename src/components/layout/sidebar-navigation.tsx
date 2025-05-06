
import {
  CalendarDays,
  ChevronsLeft,
  CircleUser,
  FilePen,
  FileText,
  Home,
  LogOut,
  MessageSquare,
  Settings,
  User,
  History,
  BrainCircuit,
  BarChart4,
  Bell,
  MailCheck,
  AlertTriangle,
  Clock,
  Settings2,
  Database
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User as UserType, UserRole } from "@/types";

const workerLinks = [
  { name: "Dashboard", href: "/dashboard", icon: Home, ariaLabel: "Ir a Dashboard" },
  { name: "Mi Calendario", href: "/calendar", icon: CalendarDays, ariaLabel: "Ir a Mi Calendario" },
  { name: "Solicitudes", href: "/requests", icon: FilePen, ariaLabel: "Ir a Solicitudes" },
  { name: "Documentos", href: "/documents", icon: FileText, ariaLabel: "Ir a Documentos" },
  { name: "Permisos", href: "/leave-request", icon: Clock, ariaLabel: "Ir a Permisos" },
  { name: "Cambios de turno", href: "/shift-change-request", icon: History, ariaLabel: "Ir a Cambios de turno" },
  { name: "Perfiles de turno", href: "/shift-profile", icon: Settings2, ariaLabel: "Ir a Perfiles de turno" },
  { name: "Historial", href: "/history", icon: History, ariaLabel: "Ir a Historial" },
  { name: "Chat", href: "/chat", icon: MessageSquare, ariaLabel: "Ir a Chat" },
  { name: "Perfil", href: "/profile", icon: User, ariaLabel: "Ir a Perfil" },
];

const hrLinks = [
  { name: "Dashboard", href: "/rrhh/dashboard", icon: Home, ariaLabel: "Ir a Dashboard" },
  { name: "Calendarios", href: "/rrhh/calendar", icon: CalendarDays, ariaLabel: "Ir a Gestión de Calendarios" },
  { name: "Solicitudes", href: "/rrhh/requests", icon: FilePen, ariaLabel: "Ir a Gestión de Solicitudes" },
  { name: "Personal", href: "/rrhh/workers", icon: User, ariaLabel: "Ir a Gestión de Personal" },
  { name: "Documentos", href: "/rrhh/documents", icon: FileText, ariaLabel: "Ir a Documentos" },
  { name: "Notificaciones", href: "/rrhh/notifications", icon: Bell, ariaLabel: "Ir a Notificaciones" },
  { name: "Plantillas", href: "/rrhh/notification-templates", icon: MailCheck, ariaLabel: "Ir a Plantillas de Notificaciones" },
  { name: "Asistente IA", href: "/rrhh/ai-assistant", icon: BrainCircuit, ariaLabel: "Ir a Asistente IA" },
  { name: "Asistente Inteligente", href: "/rrhh/smart-assistant", icon: AlertTriangle, ariaLabel: "Ir a Asistente Inteligente" },
  { name: "Generador de Datos", href: "/rrhh/data-generation", icon: Database, ariaLabel: "Ir a Generador de Datos" },
  { name: "Informes", href: "/rrhh/reports", icon: BarChart4, ariaLabel: "Ir a Informes" },
  { name: "Chat", href: "/chat", icon: MessageSquare, ariaLabel: "Ir a Chat" },
  { name: "Dashboard IA", href: "/rrhh/ai-dashboard", icon: BrainCircuit, ariaLabel: "Ir a Dashboard IA" },
  { name: "Configuración", href: "/rrhh/settings", icon: Settings, ariaLabel: "Ir a Configuración" }
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
  // Ensure we're using the correct role - use specific role passed or fall back to defaults
  const effectiveRole = role || (user?.role || "worker");
  const links = effectiveRole === "hr" ? hrLinks : workerLinks;
  
  console.log("SidebarNavigation rendering with role:", effectiveRole, "showing links:", links.map(l => l.name).join(", "));
  
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
    <div className="h-full flex flex-col bg-sidebar border-r border-sidebar-border">
      <div className={cn(
        "flex h-14 items-center border-b border-sidebar-border px-4",
        collapsed ? "justify-center" : "justify-between"
      )}>
        {!collapsed && <span className="text-lg font-bold text-sidebar-foreground">La Rioja Cuida</span>}
        {onCollapse && (
          <Button variant="ghost" size="icon" onClick={onCollapse} aria-label="Colapsar menú" className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
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
                "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                props.isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground",
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
        "mt-auto border-t border-sidebar-border p-4",
        collapsed ? "flex justify-center" : ""
      )}>
        {user && (
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
                    {effectiveRole === "hr" ? "RRHH" : "Trabajador"}
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
        )}
        
        {!collapsed && (
          <div className="flex items-center gap-2">
            <NavLink
              to="/profile"
              className={({ isActive }) => cn(
                "w-full flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground"
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
            className={cn("w-full mt-2 border-sidebar-border bg-transparent text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground", collapsed && "p-2")} 
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
