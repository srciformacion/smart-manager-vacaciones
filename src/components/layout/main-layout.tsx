
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

export interface MainLayoutProps {
  children: React.ReactNode;
  user?: User | null;
}

export function MainLayout({ children, user }: MainLayoutProps) {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const { signOut } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  async function logout() {
    await signOut();
    navigate("/login");
  }

  return (
    <div className="flex h-screen bg-background">
      <MainSidebar />
      <div className="flex flex-col flex-1">
        <header className="z-10 flex items-center justify-between h-16 px-4 border-b shrink-0 bg-secondary">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="mr-2 lg:hidden">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4"
                >
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
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
          <div className="flex items-center gap-2 ml-auto">
            <InstallPWAButton />
            <ThemeToggle />
            {mounted && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative w-8 h-8 rounded-full">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={user?.image} alt={user?.name} />
                      <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel>
                    {user?.name}
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
