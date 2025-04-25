
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { UserRole } from "@/types";
import {
  Calendar, 
  Clock,
  LayoutDashboard,
  MessageSquare,
  PersonStanding,
  Settings,
  User,
} from "lucide-react";

interface SidebarNavigationProps {
  role: UserRole;
}

export function SidebarNavigation({ role = "worker" }: SidebarNavigationProps) {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Enlaces para trabajadores
  const workerLinks = [
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
  
  // Enlaces para recursos humanos
  const hrLinks = [
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
  
  const links = role === "hr" ? hrLinks : workerLinks;

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
        >
          {link.icon}
          <span className="ml-3">{link.label}</span>
        </Link>
      ))}
    </div>
  );
}
