import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { UserRole } from "@/types";
import { LogOut } from "lucide-react";
import {
  Calendar, 
  Clock,
  LayoutDashboard,
  MessageSquare,
  PersonStanding,
  Settings,
  User,
  Brain,
  Bell,
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface NavLink {
  href: string;
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  role?: string;
}

interface SidebarNavigationProps {
  role?: UserRole;
  onLogout?: () => void;
  onNavigate?: () => void;
}

export function SidebarNavigation({ role = "worker", onLogout, onNavigate }: SidebarNavigationProps) {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem("user");
      localStorage.removeItem("userRole");
      
      // Dispatch storage event to notify other tabs
      window.dispatchEvent(new Event("storage"));
      
      // Notify user
      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión correctamente",
      });

      // Use onLogout callback if provided
      if (onLogout) {
        onLogout();
      }
      
      // Navigate to auth page (using window.location to ensure full page reload)
      window.location.href = "/auth";
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      toast({
        variant: "destructive",
        title: "Error al cerrar sesión",
        description: "Ocurrió un error inesperado",
      });
    }
  };

  const workerLinks: NavLink[] = [
    {
      href: "/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      label: "Dashboard",
    },
    {
      href: "/solicitudes/vacaciones",
      icon: <Calendar className="h-5 w-5" />,
      label: "Solicitud de vacaciones",
    },
    {
      href: "/solicitudes/asuntos-propios",
      icon: <Clock className="h-5 w-5" />,
      label: "Asuntos propios",
    },
    {
      href: "/solicitudes/permisos",
      icon: <Clock className="h-5 w-5" />,
      label: "Permisos",
    },
    {
      href: "/perfiles-turno",
      icon: <Settings className="h-5 w-5" />,
      label: "Perfiles de turno",
    },
    {
      href: "/historial",
      icon: <Clock className="h-5 w-5" />,
      label: "Historial",
    },
    {
      href: "/chat",
      icon: <MessageSquare className="h-5 w-5" />,
      label: "Chat",
    },
    {
      href: "/perfil",
      icon: <User className="h-5 w-5" />,
      label: "Perfil",
    },
  ];
  
  const hrLinks: NavLink[] = [
    {
      href: "/rrhh/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      label: "Dashboard",
    },
    {
      href: "/rrhh/solicitudes",
      icon: <Calendar className="h-5 w-5" />,
      label: "Gestión de solicitudes",
    },
    {
      href: "/rrhh/trabajadores",
      icon: <PersonStanding className="h-5 w-5" />,
      label: "Gestión de trabajadores",
    },
    {
      href: "/rrhh/calendarios",
      icon: <Calendar className="h-5 w-5" />,
      label: "Calendarios y turnos",
    },
    {
      href: "/rrhh/asistente",
      icon: <MessageSquare className="h-5 w-5" />,
      label: "Asistente inteligente",
    },
    {
      href: "/rrhh/ai-assistant",
      icon: <Brain className="h-5 w-5" />,
      label: "Asistente IA",
      role: "hr",
    },
    {
      href: "/rrhh/notificaciones",
      icon: <Bell className="h-5 w-5" />,
      label: "Envío de notificaciones",
      role: "hr",
    },
    {
      href: "/chat",
      icon: <MessageSquare className="h-5 w-5" />,
      label: "Chat",
    },
    {
      href: "/perfil",
      icon: <User className="h-5 w-5" />,
      label: "Perfil",
    },
  ];
  
  const links = [
    ...(role === "hr" ? hrLinks : workerLinks),
    {
      href: "#",
      icon: <LogOut className="h-5 w-5" />,
      label: "Cerrar sesión",
      onClick: handleLogout,
    },
  ];

  return (
    <div className="space-y-1">
      {links.map((link) => (
        <Link
          key={link.href}
          to={link.href}
          className={cn(
            "flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
            isActive(link.href) ? "bg-accent text-accent-foreground" : "transparent"
          )}
          onClick={(e) => {
            if (link.onClick) {
              e.preventDefault();
              link.onClick();
            }
            onNavigate?.();
          }}
        >
          {link.icon}
          <span className="ml-3">{link.label}</span>
        </Link>
      ))}
    </div>
  );
}
