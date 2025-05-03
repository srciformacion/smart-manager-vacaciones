
import { ReactNode, useState } from "react";
import { SidebarNavigation } from "./sidebar-navigation";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { User, UserRole } from "@/types";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, LogOut } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { InstallPWAButton } from "@/components/pwa/install-pwa-button";
import { useAuth } from "@/hooks/use-auth";

interface MainLayoutMobileProps {
  children: ReactNode;
  user?: User | null;
  className?: string;
}

export function MainLayoutMobile({ children, user, className }: MainLayoutMobileProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  
  const handleLogout = async () => {
    try {
      await signOut();
      // No necesitamos redirigir aquí, ya que signOut() ya lo hace
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      toast.error("Error al cerrar sesión");
    }
  };

  if (!isMobile) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          {user && (
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="mr-2">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0">
                <SidebarNavigation 
                  role={user.role as UserRole} 
                  onLogout={handleLogout}
                  onNavigate={() => setSidebarOpen(false)}
                />
              </SheetContent>
            </Sheet>
          )}
          <div className="flex flex-1 items-center justify-between space-x-2">
            <div className="flex items-center">
              <span 
                className="font-bold cursor-pointer" 
                onClick={() => user ? navigate(user.role === "hr" ? "/rrhh/dashboard" : "/dashboard") : navigate("/")}
              >
                La Rioja Cuida
              </span>
            </div>
            <div className="flex items-center gap-2">
              <InstallPWAButton />
              {user && <NotificationBell />}
              <ThemeToggle />
              {user && (
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={handleLogout}
                  className="text-muted-foreground hover:text-foreground"
                  aria-label="Cerrar sesión"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className={cn(
        "flex-1 container py-4",
        "max-w-full overflow-x-hidden",
        className
      )}>
        {children}
      </main>
    </div>
  );
}
