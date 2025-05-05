
import { NavLink } from "react-router-dom";
import { User, UserRole } from "@/types";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { InstallPWAButton } from "@/components/pwa/install-pwa-button";

interface NavItem {
  to: string;
  label: string;
  icon?: React.ReactNode;
  requiredRole?: UserRole;
  visible?: boolean;
}

// Update the props interface to accept either user or role and optional callbacks
interface SidebarNavigationProps {
  user?: User | null;
  role?: UserRole;
  onLogout?: () => void | Promise<void>;
  onNavigate?: () => void;
}

export function SidebarNavigation({ user, role, onLogout, onNavigate }: SidebarNavigationProps) {
  // Determine role from props - either directly provided or from user object
  const userRole = role || user?.role || 'worker';
  console.log("SidebarNavigation - User role:", userRole);
  
  const navigationItems: NavItem[] = [
    // Worker navigation items
    { to: "/dashboard", label: "Dashboard", requiredRole: 'worker' },
    { to: "/profile", label: "Mi Perfil" },
    { to: "/calendar", label: "Calendario", requiredRole: 'worker' },
    { to: "/requests/vacation", label: "Solicitar Vacaciones", requiredRole: 'worker' },
    { to: "/requests/personal-day", label: "Solicitar Día Personal", requiredRole: 'worker' },
    { to: "/requests/leave", label: "Solicitar Permiso", requiredRole: 'worker' },
    { to: "/requests/shift-change", label: "Solicitar Cambio de Turno", requiredRole: 'worker' },
    { to: "/history", label: "Historial", requiredRole: 'worker' },
    { to: "/shift-profile", label: "Mi Perfil de Turno", requiredRole: 'worker' },
    // HR navigation items
    { to: "/rrhh/dashboard", label: "Dashboard RRHH", requiredRole: 'hr' },
    { to: "/rrhh/calendar", label: "Calendario RRHH", requiredRole: 'hr' },
    { to: "/rrhh/requests", label: "Gestionar Solicitudes", requiredRole: 'hr' },
    { to: "/rrhh/workers", label: "Gestionar Trabajadores", requiredRole: 'hr' },
    { to: "/rrhh/notification", label: "Enviar Notificación", requiredRole: 'hr' },
    { to: "/rrhh/calendar-notification", label: "Notificar Calendario", requiredRole: 'hr' },
    { to: "/rrhh/ai-assistant", label: "Asistente IA", requiredRole: 'hr' },
    { to: "/rrhh/ai-dashboard", label: "Dashboard IA", requiredRole: 'hr' },
    // Shared navigation items
    { to: "/chat", label: "Chat" },
  ];

  // Filter navigation items based on user role
  const filteredNavigationItems = navigationItems.filter(item => {
    if (!item.requiredRole) return true; // Always show items without a required role
    if (item.requiredRole === userRole) return true; // Show items matching the user's role
    return false; // Don't show items for other roles
  });

  const handleNavClick = () => {
    if (onNavigate) {
      onNavigate();
    }
  };

  console.log("Filtered navigation items:", filteredNavigationItems.map(item => item.label));

  return (
    <div className="flex flex-col h-full bg-sidebar text-sidebar-foreground">
      <div className="px-4 py-6">
        <NavLink to={userRole === 'hr' ? "/rrhh/dashboard" : "/dashboard"}>
          <Button variant="ghost" className="font-bold text-lg w-full text-sidebar-foreground">
            La Rioja Cuida
          </Button>
        </NavLink>
      </div>
      <Separator className="bg-sidebar-border" />
      <nav className="flex-1 px-2 py-4 overflow-y-auto">
        <ul className="space-y-1">
          {filteredNavigationItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `block rounded-md px-3 py-2 text-sm font-medium transition-colors
                  ${isActive 
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground font-bold' 
                    : 'text-sidebar-foreground hover:bg-sidebar-primary/20 hover:text-sidebar-foreground'
                  }`
                }
                onClick={handleNavClick}
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      {onLogout && (
        <>
          <Separator className="bg-sidebar-border" />
          <div className="p-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onLogout} 
              className="w-full bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
            >
              Cerrar sesión
            </Button>
          </div>
        </>
      )}
      <Separator className="bg-sidebar-border" />
      <div className="flex items-center gap-2 p-4">
        <ThemeToggle />
        <NotificationBell />
        <InstallPWAButton />
      </div>
    </div>
  );
}
