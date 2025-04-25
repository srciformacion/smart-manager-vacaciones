import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { UserRole } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
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
} from "lucide-react";

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

  // Logout handler
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Error al cerrar sesión",
          description: error.message,
        });
        return;
      }

      // Clear user role from localStorage
      localStorage.removeItem("userRole");

      // Call onLogout prop if provided
      onLogout?.();

      // Navigate to auth page
      window.location.href = "/auth";
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error al cerrar sesión",
        description: "Ocurrió un error inesperado",
      });
    }
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
      href: "/rrhh/ai-assistant",
      icon: <Brain className="h-5 w-5" />,
      label: "Asistente IA",
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
  
  const commonLinks = [
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
    {
      href: "#",
      icon: <LogOut className="h-5 w-5" />,
      label: "Cerrar sesión",
      onClick: handleLogout,
    },
  ];

  const links = [
    ...(role === "hr" ? hrLinks : workerLinks),
    ...commonLinks,
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
