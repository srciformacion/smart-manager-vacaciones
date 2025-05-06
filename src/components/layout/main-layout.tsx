
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MainSidebar } from "./main-sidebar";
import { InstallPWAButton } from '@/components/pwa/install-pwa-button';
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { User } from "@/types";
import { useAuth } from "@/hooks/use-auth";
import { Sidebar as SidebarIcon } from "lucide-react";

export interface MainLayoutProps {
  children: React.ReactNode;
  user?: User | null;
}

export function MainLayout({ children, user }: MainLayoutProps) {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const { signOut } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  async function logout() {
    await signOut();
    navigate("/login");
  }

  // Función para alternar la visibilidad del sidebar
  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar condicional */}
      <div className={`transition-all duration-300 ${sidebarVisible ? 'w-64' : 'w-0 overflow-hidden'}`}>
        <MainSidebar />
      </div>
      <div className="flex flex-col flex-1">
        <header className="z-10 flex items-center justify-between h-16 px-4 border-b shrink-0 bg-secondary">
          <div className="flex items-center">
            {/* Botón para mostrar/ocultar el sidebar en pantallas grandes */}
            <Button variant="ghost" size="sm" onClick={toggleSidebar} className="mr-2">
              <SidebarIcon className="w-5 h-5" />
            </Button>
            
            {/* Sheet para menú móvil */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="mr-2 lg:hidden">
                  <SidebarIcon className="w-4 h-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full sm:max-w-[300px]">
                <SheetHeader>
                  <SheetTitle>Menú</SheetTitle>
                  <SheetDescription>
                    Navega a través de las diferentes opciones.
                  </SheetDescription>
                </SheetHeader>
                <MainSidebar />
              </SheetContent>
            </Sheet>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <InstallPWAButton />
            <ThemeToggle />
            {mounted && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative w-8 h-8 rounded-full">
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
              <Link to="/login">
                <Button>Login</Button>
              </Link>
            )}
          </div>
        </header>
        <main className="flex-1 p-4">{children}</main>
      </div>
    </div>
  );
}
