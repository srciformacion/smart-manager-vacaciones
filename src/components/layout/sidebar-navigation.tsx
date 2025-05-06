
import { NavLink } from "react-router-dom";
import { User, UserRole } from "@/types";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { InstallPWAButton } from "@/components/pwa/install-pwa-button";
import { 
  LayoutDashboard, 
  User as UserIcon, 
  Calendar, 
  Home, 
  Settings, 
  MenuSquare,
  FileText,
  Clock,
  CalendarClock,
  MessageSquare,
  BrainCircuit,
  Bell
} from "lucide-react";

interface NavItem {
  to: string;
  label: string;
  icon: React.ReactNode;
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
    { to: "/dashboard", label: "Dashboard", icon: <LayoutDashboard className="h-4 w-4" />, requiredRole: 'worker' },
    { to: "/profile", label: "Mi Perfil", icon: <UserIcon className="h-4 w-4" /> },
    { to: "/calendar", label: "Calendario", icon: <Calendar className="h-4 w-4" />, requiredRole: 'worker' },
    { to: "/requests/vacation", label: "Solicitar Vacaciones", icon: <CalendarClock className="h-4 w-4" />, requiredRole: 'worker' },
    { to: "/requests/personal-day", label: "Solicitar Día Personal", icon: <Clock className="h-4 w-4" />, requiredRole: 'worker' },
    { to: "/requests/leave", label: "Solicitar Permiso", icon: <FileText className="h-4 w-4" />, requiredRole: 'worker' },
    { to: "/requests/shift-change", label: "Solicitar Cambio de Turno", icon: <MenuSquare className="h-4 w-4" />, requiredRole: 'worker' },
    { to: "/history", label: "Historial", icon: <Clock className="h-4 w-4" />, requiredRole: 'worker' },
    { to: "/shift-profile", label: "Mi Perfil de Turno", icon: <UserIcon className="h-4 w-4" />, requiredRole: 'worker' },
    // HR navigation items
    { to: "/rrhh/dashboard", label: "Dashboard RRHH", icon: <LayoutDashboard className="h-4 w-4" />, requiredRole: 'hr' },
    { to: "/rrhh/calendar", label: "Calendario RRHH", icon: <Calendar className="h-4 w-4" />, requiredRole: 'hr' },
    { to: "/rrhh/requests", label: "Gestionar Solicitudes", icon: <FileText className="h-4 w-4" />, requiredRole: 'hr' },
    { to: "/rrhh/workers", label: "Gestionar Trabajadores", icon: <UserIcon className="h-4 w-4" />, requiredRole: 'hr' },
    { to: "/rrhh/notification", label: "Enviar Notificación", icon: <Bell className="h-4 w-4" />, requiredRole: 'hr' },
    { to: "/rrhh/calendar-notification", label: "Notificar Calendario", icon: <Calendar className="h-4 w-4" />, requiredRole: 'hr' },
    { to: "/rrhh/ai-assistant", label: "Asistente IA", icon: <BrainCircuit className="h-4 w-4" />, requiredRole: 'hr' },
    { to: "/rrhh/ai-dashboard", label: "Dashboard IA", icon: <LayoutDashboard className="h-4 w-4" />, requiredRole: 'hr' },
    // Shared navigation items
    { to: "/chat", label: "Chat", icon: <MessageSquare className="h-4 w-4" /> },
  ];

  // Ensure filteredNavigationItems is working correctly by showing all items when no role restrictions match
  const filteredNavigationItems = navigationItems.filter(item => {
    // If no role requirement or always visible, show the item
    if (!item.requiredRole) return true;
    
    // Show items matching the user's role
    return item.requiredRole === userRole;
  });

  const handleNavClick = () => {
    if (onNavigate) {
      onNavigate();
    }
  };

  console.log("Filtered navigation items:", filteredNavigationItems.map(item => item.label));

  return (
    <div className="flex flex-col h-full bg-blue-600 text-white">
      <div className="px-4 py-6">
        <NavLink to={userRole === 'hr' ? "/rrhh/dashboard" : "/dashboard"}>
          <Button variant="ghost" className="font-bold text-lg w-full text-white hover:bg-blue-700">
            La Rioja Cuida
          </Button>
        </NavLink>
      </div>
      <Separator className="bg-blue-500" />
      <nav className="flex-1 px-2 py-4 overflow-y-auto">
        <ul className="space-y-1">
          {filteredNavigationItems.length > 0 ? (
            filteredNavigationItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors
                    ${isActive 
                      ? 'bg-blue-800 text-white font-bold' 
                      : 'text-white hover:bg-blue-700 hover:text-white'
                    }`
                  }
                  onClick={handleNavClick}
                >
                  <span className="mr-2 flex items-center justify-center">{item.icon}</span>
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))
          ) : (
            <li className="px-3 py-2 text-sm">No hay elementos de navegación disponibles</li>
          )}
        </ul>
      </nav>
      {onLogout && (
        <>
          <Separator className="bg-blue-500" />
          <div className="p-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onLogout} 
              className="w-full bg-blue-700 text-white hover:bg-blue-800"
            >
              Cerrar sesión
            </Button>
          </div>
        </>
      )}
      <Separator className="bg-blue-500" />
      <div className="flex items-center justify-center gap-2 p-4">
        <ThemeToggle />
        <NotificationBell />
        <InstallPWAButton />
      </div>
    </div>
  );
}

