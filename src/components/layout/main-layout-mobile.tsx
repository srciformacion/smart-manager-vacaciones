
import { ReactNode, useState } from "react";
import { SidebarNavigation } from "./sidebar-navigation";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { User, UserRole } from "@/types";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface MainLayoutMobileProps {
  children: ReactNode;
  user?: User | null;
  className?: string;
}

export function MainLayoutMobile({ children, user, className }: MainLayoutMobileProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();
  
  const handleLogout = () => {
    console.log("Logout");
    window.location.href = "/login";
  };

  if (!isMobile) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header móvil */}
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
                  userRole={user.role as UserRole} 
                  onLogout={handleLogout}
                  onNavigate={() => setSidebarOpen(false)}
                />
              </SheetContent>
            </Sheet>
          )}
          <div className="flex flex-1 items-center justify-between space-x-2">
            <span className="font-bold">La Rioja Cuida</span>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Contenido principal */}
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
