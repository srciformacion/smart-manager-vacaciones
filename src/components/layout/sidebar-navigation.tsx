
import { Link, NavLink, useLocation } from "react-router-dom";
import { Fragment } from "react";
import { User, UserRole } from "@/types";
import { 
  LogOut, 
  User as UserIcon, 
  Calendar, 
  FileText, 
  Bell, 
  Briefcase,
  Home,
  Info,
  Settings,
  Users,
  Bot,
  Clock
} from "lucide-react";

interface SidebarNavigationProps {
  user: User | null;
  role: UserRole;
  onLogout: () => void;
  onNavigate?: () => void;
}

export function SidebarNavigation({ 
  user, 
  role, 
  onLogout,
  onNavigate 
}: SidebarNavigationProps) {
  const location = useLocation();
  
  const handleNavigation = () => {
    if (onNavigate) {
      onNavigate();
    }
  };
  
  const workerNav = [
    {
      name: "Inicio",
      to: "/worker/dashboard",
      icon: <Home className="h-5 w-5" aria-hidden="true" />
    },
    {
      name: "Calendario",
      to: "/worker/calendar",
      icon: <Calendar className="h-5 w-5" aria-hidden="true" />
    },
    {
      name: "Solicitudes",
      to: "/worker/requests",
      icon: <FileText className="h-5 w-5" aria-hidden="true" />
    },
    {
      name: "Notificaciones",
      to: "/worker/notifications",
      icon: <Bell className="h-5 w-5" aria-hidden="true" />
    },
  ];
  
  const hrNav = [
    {
      name: "Inicio",
      to: "/hr/dashboard",
      icon: <Home className="h-5 w-5" aria-hidden="true" />
    },
    {
      name: "Gestión",
      to: "/hr/management",
      icon: <Briefcase className="h-5 w-5" aria-hidden="true" />
    },
    {
      name: "Personal",
      to: "/hr/staff",
      icon: <Users className="h-5 w-5" aria-hidden="true" />
    },
    {
      name: "Calendarios",
      to: "/hr/calendars",
      icon: <Calendar className="h-5 w-5" aria-hidden="true" />
    },
    {
      name: "Solicitudes",
      to: "/hr/requests",
      icon: <FileText className="h-5 w-5" aria-hidden="true" />
    },
    {
      name: "Asistente IA",
      to: "/hr/ai",
      icon: <Bot className="h-5 w-5" aria-hidden="true" />
    },
    {
      name: "Notificaciones",
      to: "/hr/notifications",
      icon: <Bell className="h-5 w-5" aria-hidden="true" />
    }
  ];

  const navItems = role === "hr" ? hrNav : workerNav;
  
  return (
    <div className="flex h-full flex-col justify-between py-4">
      <div>
        <div className="px-3 py-2 mb-6">
          <Link
            to={role === "hr" ? "/hr/dashboard" : "/worker/dashboard"}
            onClick={handleNavigation}
            className="flex items-center gap-2 text-xl font-bold text-primary"
            aria-label="Ir al tablero principal"
          >
            <Clock className="h-6 w-6" aria-hidden="true" />
            <span>TurnoSync</span>
          </Link>
        </div>

        <nav aria-label="Navegación principal">
          <ul className="space-y-1 px-2">
            {navItems.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium ${
                      isActive 
                        ? "bg-primary text-primary-foreground" 
                        : "hover:bg-accent hover:text-accent-foreground"
                    }`
                  }
                  onClick={handleNavigation}
                  aria-current={({ isActive }) => isActive ? "page" : undefined}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="space-y-1 px-3">
        {user && (
          <Link 
            to="/profile" 
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
            onClick={handleNavigation}
            aria-label="Ver tu perfil"
          >
            <UserIcon className="h-5 w-5" aria-hidden="true" />
            <span className="truncate">{user.name || 'Mi perfil'}</span>
          </Link>
        )}
        
        <button
          onClick={() => {
            onLogout();
            if (onNavigate) onNavigate();
          }}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
          aria-label="Cerrar sesión"
        >
          <LogOut className="h-5 w-5" aria-hidden="true" />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </div>
  );
}
