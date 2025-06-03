
import { useState } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { SidebarNavigation } from "./sidebar-navigation";
import { useAuth } from "@/hooks/auth";
import { User, UserRole } from "@/types";

interface MainLayoutMobileProps {
  user: User | null;
  role?: UserRole;
  children: React.ReactNode;
}

export function MainLayoutMobile({
  user,
  role = "worker",
  children,
}: MainLayoutMobileProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { signOut } = useAuth();

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const handleLogout = async () => {
    await signOut();
    closeSidebar();
  };

  const handleNavigation = () => {
    closeSidebar();
  };

  return (
    <div className="min-h-screen w-full bg-background flex flex-col">
      <header className="sticky top-0 z-40 border-b h-14 flex items-center px-4 md:hidden bg-background">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="w-8 h-8 flex items-center justify-center"
          aria-label="Abrir menú"
        >
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
          >
            <line x1="4" x2="20" y1="12" y2="12" />
            <line x1="4" x2="20" y1="6" y2="6" />
            <line x1="4" x2="20" y1="18" y2="18" />
          </svg>
        </button>
        <div className="ml-4 text-lg font-bold">La Rioja Cuida</div>
      </header>

      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetContent side="left" className="p-0 w-[240px] sm:w-[300px] bg-sidebar border-r border-sidebar-border">
          <SidebarNavigation
            user={user}
            role={role}
            onLogout={handleLogout}
            onNavigate={handleNavigation}
          />
        </SheetContent>
      </Sheet>

      <main className="flex-1">{children}</main>
    </div>
  );
}
