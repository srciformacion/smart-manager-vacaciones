
import { Menu, LogOut } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { SidebarNavigation } from "./sidebar-navigation";
import { User } from "@/types";
import { useIsMobile } from "@/hooks/use-mobile";
import { MainLayoutMobile } from "./main-layout-mobile";
import { NotificationCenter } from "@/components/notifications/NotificationCenter";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/use-auth";

export function MainLayout({ user, children }: { user: User | null, children: React.ReactNode }) {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
      // Note: The navigation will happen in the useAuth hook
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      toast({
        variant: "destructive",
        title: "Error al cerrar sesión",
        description: "Ocurrió un error inesperado",
      });
    }
  };

  if (isMobile) {
    return <MainLayoutMobile user={user}>{children}</MainLayoutMobile>;
  }

  return (
    <div className="h-full">
      <div className="hidden md:fixed md:inset-y-0 md:z-50 md:flex md:w-72 md:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r bg-background px-6 pb-4">
          <div className="h-16 flex items-center">
            <h2 
              className="text-lg font-semibold cursor-pointer" 
              onClick={() => user ? navigate(user.role === "hr" ? "/rrhh/dashboard" : "/dashboard") : navigate("/")}
            >
              La Rioja Cuida
            </h2>
          </div>

          <SidebarNavigation role={user?.role} onLogout={handleLogout} />
        </div>
      </div>

      <div className="md:pl-72">
        <div className="sticky top-0 z-40 flex h-16 items-center gap-x-4 border-b bg-background px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <Button
            variant="outline"
            size="icon"
            className="md:hidden"
            aria-label="Open Sidebar"
            onClick={() => {
              // Sidebar toggle logic would go here if needed
              console.log("Sidebar toggle");
            }}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex-1" />
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <NotificationCenter />
              <ThemeToggle />
              <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200 dark:lg:bg-gray-700" />
              <div className="flex items-center">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <span className="sr-only">Your profile</span>
                  <Avatar>
                    <AvatarFallback>
                      {user?.name && user?.name[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
                <div className="ml-2">
                  <p className="text-sm font-medium">{user?.name || "Usuario"}</p>
                  <p className="text-xs text-muted-foreground">
                    {user?.role === "hr" ? "RRHH" : "Trabajador"}
                  </p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={handleLogout}
                className="text-muted-foreground hover:text-foreground hover:bg-accent"
                aria-label="Cerrar sesión"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
