
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
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { signOut } = useAuth();
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  async function logout() {
    await signOut();
    navigate("/auth", {
      replace: true
    });
  }

  // Función para alternar la visibilidad del sidebar
  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  // Función para cerrar el menú móvil
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };
  
  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar condicional para pantallas grandes */}
      {sidebarVisible && <div className="hidden lg:block w-64">
          <MainSidebar onNavigate={closeMobileMenu} />
        </div>}
      
      <div className="flex flex-col flex-1">
        <header className="z-10 flex items-center justify-between h-16 px-4 border-b shrink-0 bg-secondary">
          <div className="flex items-center">
            {/* Botón para mostrar/ocultar el sidebar en pantallas grandes */}
            <Button variant="ghost" size="sm" onClick={toggleSidebar} className="mr-2 hidden lg:flex" aria-label={sidebarVisible ? "Ocultar menú lateral" : "Mostrar menú lateral"}>
              <MenuIcon className="w-5 h-5" />
            </Button>
            
            {/* Sheet para menú móvil */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetContent side="left" className="p-0 w-[85%] sm:w-[300px] border-r border-sidebar-border">
                <MainSidebar onNavigate={closeMobileMenu} />
              </SheetContent>
            </Sheet>
            
            {/* Botón hamburguesa para dispositivos móviles */}
            <Button variant="ghost" size="sm" onClick={() => setMobileMenuOpen(true)} className="mr-2 lg:hidden" aria-label="Abrir menú de navegación" aria-expanded={mobileMenuOpen} aria-controls="mobile-menu">
              <MenuIcon className="w-5 h-5" />
            </Button>
            
            {/* Título o logo de la aplicación */}
            <span className="text-lg font-bold">La Rioja Cuida</span>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <InstallPWAButton />
            <ThemeToggle />
            {mounted && user ? <DropdownMenu>
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
              </DropdownMenu> : <Link to="/auth">
                <Button>Login</Button>
              </Link>}
          </div>
        </header>
        <main className="flex-1 p-4 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
