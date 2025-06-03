import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MainSidebar } from "./main-sidebar";
import { InstallPWAButton } from '@/components/pwa/install-pwa-button';
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { User } from "@/types";
import { useAuth } from "@/hooks/auth";
import { Menu as MenuIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

export interface MainLayoutProps {
  children: React.ReactNode;
  user?: User | null;
}

export function MainLayout({
  children,
  user
}: MainLayoutProps) {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { signOut } = useAuth();
  const isMobile = useIsMobile();
  
  useEffect(() => {
    setMounted(true);
    // Load sidebar state from localStorage
    const savedCollapsed = localStorage.getItem('sidebar-collapsed');
    if (savedCollapsed !== null) {
      setSidebarCollapsed(JSON.parse(savedCollapsed));
    }
  }, []);
  
  async function logout() {
    await signOut();
    navigate("/auth", {
      replace: true
    });
  }

  // Función para alternar el estado contraído del sidebar
  const toggleSidebarCollapse = () => {
    const newCollapsed = !sidebarCollapsed;
    setSidebarCollapsed(newCollapsed);
    localStorage.setItem('sidebar-collapsed', JSON.stringify(newCollapsed));
  };

  // Función para cerrar el menú móvil
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };
  
  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar solo visible en pantallas grandes */}
      {!isMobile && (
        <div className={cn(
          "transition-all duration-300",
          sidebarCollapsed ? "w-16" : "w-64"
        )}>
          <MainSidebar 
            onNavigate={closeMobileMenu}
            collapsed={sidebarCollapsed}
            onCollapse={toggleSidebarCollapse}
          />
        </div>
      )}
      
      <div className="flex flex-col flex-1">
        <header className="z-10 flex items-center justify-between h-16 px-4 border-b shrink-0 bg-secondary">
          <div className="flex items-center">
            {/* Sheet para menú móvil */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetContent side="left" className="p-0 w-[85%] sm:w-[300px] border-r border-sidebar-border">
                <MainSidebar onNavigate={closeMobileMenu} />
              </SheetContent>
            </Sheet>
            
            {/* Botón hamburguesa para dispositivos móviles */}
            {isMobile && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setMobileMenuOpen(true)} 
                className="mr-2" 
                aria-label="Abrir menú de navegación" 
                aria-expanded={mobileMenuOpen} 
                aria-controls="mobile-menu"
              >
                <MenuIcon className="w-5 h-5" />
              </Button>
            )}
            
            {/* Título o logo de la aplicación */}
            <span className="text-lg font-bold">Workify SRCI</span>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <InstallPWAButton />
            <ThemeToggle />
            {mounted && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative w-8 h-8 rounded-full" aria-label="Opciones de usuario">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={user.profilePicture} alt={user.name || 'Usuario'} />
                      <AvatarFallback>{user.name ? user.name.charAt(0) : 'U'}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel>
                    {user?.name || 'Usuario'}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    Perfil
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => logout()}>
                    Salir
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth">
                <Button>Login</Button>
              </Link>
            )}
          </div>
        </header>
        <main className="flex-1 p-4 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
