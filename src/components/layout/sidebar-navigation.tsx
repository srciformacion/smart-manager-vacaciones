
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
  requiredRole?: 'worker' | 'hr';
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
  const userRole = role || user?.role;
  
  const navigationItems: NavItem[] = [
    { to: "/dashboard", label: "Dashboard", requiredRole: 'worker' },
    { to: "/rrhh/dashboard", label: "Dashboard RRHH", requiredRole: 'hr' },
    { to: "/profile", label: "Mi Perfil" },
    { to: "/calendar", label: "Calendario", requiredRole: 'worker' },
    { to: "/rrhh/calendar", label: "Calendario RRHH", requiredRole: 'hr' },
    { to: "/requests/vacation", label: "Solicitar Vacaciones", requiredRole: 'worker' },
    { to: "/requests/personal-day", label: "Solicitar Día Personal", requiredRole: 'worker' },
    { to: "/requests/leave", label: "Solicitar Permiso", requiredRole: 'worker' },
    { to: "/requests/shift-change", label: "Solicitar Cambio de Turno", requiredRole: 'worker' },
    { to: "/history", label: "Historial", requiredRole: 'worker' },
    { to: "/shift-profile", label: "Mi Perfil de Turno", requiredRole: 'worker' },
    { to: "/rrhh/requests", label: "Gestionar Solicitudes", requiredRole: 'hr' },
    { to: "/rrhh/workers", label: "Gestionar Trabajadores", requiredRole: 'hr' },
    { to: "/rrhh/notification", label: "Enviar Notificación", requiredRole: 'hr' },
    { to: "/rrhh/calendar-notification", label: "Notificar Calendario", requiredRole: 'hr' },
    { to: "/rrhh/ai-assistant", label: "Asistente IA", requiredRole: 'hr' },
    { to: "/rrhh/ai-dashboard", label: "Dashboard IA", requiredRole: 'hr' },
    { to: "/chat", label: "Chat" },
  ];

  const filteredNavigationItems = navigationItems.filter(item => {
    if (!item.requiredRole) return true;
    return userRole === item.requiredRole;
  });

  const handleNavClick = () => {
    if (onNavigate) {
      onNavigate();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-6">
        <NavLink to="/">
          <Button variant="ghost" className="font-bold text-lg">
            La Rioja Cuida
          </Button>
        </NavLink>
      </div>
      <Separator />
      <nav className="flex-1 px-2 py-4">
        <ul className="space-y-1">
          {filteredNavigationItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `block rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-secondary hover:text-accent-foreground ${
                    isActive ? 'bg-secondary text-accent-foreground' : 'text-muted-foreground'
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
          <Separator />
          <div className="p-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onLogout} 
              className="w-full text-muted-foreground hover:text-foreground"
            >
              Cerrar sesión
            </Button>
          </div>
        </>
      )}
      <Separator />
      <div className="flex items-center gap-2 p-4">
        <ThemeToggle />
        <NotificationBell />
        <InstallPWAButton />
      </div>
    </div>
  );
}
