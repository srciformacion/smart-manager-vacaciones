import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { UserRole } from "@/types";
import {
  Calendar,
  Clock,
  FileCheck,
  Home,
  User,
  Users,
  Settings,
  Mail,
  LogOut,
  Menu,
  X,
} from "lucide-react";

interface NavItemProps {
  to: string;
  icon: React.ElementType;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

function NavItem({ to, icon: Icon, label, active, onClick }: NavItemProps) {
  return (
    <Link to={to} onClick={onClick} className="w-full">
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start gap-2 font-normal",
          active && "bg-sidebar-accent text-sidebar-accent-foreground"
        )}
      >
        <Icon className="h-4 w-4" />
        <span>{label}</span>
      </Button>
    </Link>
  );
}

interface SidebarNavigationProps {
  userRole: UserRole;
  onLogout: () => void;
}

export function SidebarNavigation({ userRole, onLogout }: SidebarNavigationProps) {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    if (isOpen) setIsOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 lg:hidden"
      >
        {isOpen ? <X /> : <Menu />}
      </Button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-sidebar transition-transform duration-300 ease-in-out transform lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full p-4">
          {/* LOGO personalizado */}
          <div className="flex flex-col items-center justify-center py-4 border-b border-sidebar-border">
            <h2 className="text-xl font-bold text-sidebar-foreground text-center">
              La Rioja Cuida
            </h2>
          </div>

          <nav className="flex-1 mt-6 space-y-1">
            <NavItem
              to="/"
              icon={Home}
              label="Inicio"
              active={isActive("/")}
              onClick={closeSidebar}
            />

            <div className="py-2">
              <h3 className="px-3 text-xs font-semibold text-sidebar-foreground/70 uppercase tracking-wider">
                Solicitudes
              </h3>
              <div className="mt-2 space-y-1">
                <NavItem
                  to="/solicitudes/vacaciones"
                  icon={Calendar}
                  label="Vacaciones"
                  active={isActive("/solicitudes/vacaciones")}
                  onClick={closeSidebar}
                />
                <NavItem
                  to="/solicitudes/asuntos-propios"
                  icon={Clock}
                  label="Asuntos propios"
                  active={isActive("/solicitudes/asuntos-propios")}
                  onClick={closeSidebar}
                />
                <NavItem
                  to="/solicitudes/permisos"
                  icon={FileCheck}
                  label="Permisos justificados"
                  active={isActive("/solicitudes/permisos")}
                  onClick={closeSidebar}
                />
                <NavItem
                  to="/historial"
                  icon={Mail}
                  label="Historial"
                  active={isActive("/historial")}
                  onClick={closeSidebar}
                />
              </div>
            </div>

            {userRole === "hr" && (
              <div className="py-2">
                <h3 className="px-3 text-xs font-semibold text-sidebar-foreground/70 uppercase tracking-wider">
                  RRHH
                </h3>
                <div className="mt-2 space-y-1">
                  <NavItem
                    to="/rrhh/trabajadores"
                    icon={Users}
                    label="Trabajadores"
                    active={isActive("/rrhh/trabajadores")}
                    onClick={closeSidebar}
                  />
                  <NavItem
                    to="/rrhh/solicitudes"
                    icon={Mail}
                    label="Solicitudes"
                    active={isActive("/rrhh/solicitudes")}
                    onClick={closeSidebar}
                  />
                  <NavItem
                    to="/rrhh/asistente"
                    icon={User}
                    label="Asistente Inteligente"
                    active={isActive("/rrhh/asistente")}
                    onClick={closeSidebar}
                  />
                </div>
              </div>
            )}

            <div className="py-2">
              <div className="mt-2 space-y-1">
                <NavItem
                  to="/perfil"
                  icon={Settings}
                  label="Mi perfil"
                  active={isActive("/perfil")}
                  onClick={closeSidebar}
                />
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2 font-normal"
                  onClick={() => {
                    onLogout();
                    closeSidebar();
                  }}
                >
                  <LogOut className="h-4 w-4" />
                  <span>Cerrar sesión</span>
                </Button>
              </div>
            </div>
          </nav>
        </div>
      </aside>
    </>
  );
}
