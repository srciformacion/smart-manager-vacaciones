
import { ReactNode, useState } from "react";
import { SidebarNavigation } from "./sidebar-navigation";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { User, UserRole } from "@/types";
import { cn } from "@/lib/utils";

interface MainLayoutProps {
  children: ReactNode;
  user?: User | null;
  className?: string;
}

export function MainLayout({ children, user, className }: MainLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  
  const handleLogout = () => {
    console.log("Logout");
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen flex bg-background">
      {user && (
        <SidebarNavigation 
          userRole={user.role as UserRole} 
          onLogout={handleLogout} 
        />
      )}
      
      <main
        className={cn(
          "flex-1 p-4 md:p-6 transition-all duration-300 ease-in-out",
          "max-w-full overflow-x-hidden",
          user ? "lg:ml-64" : "",
          className
        )}
      >
        <div className="flex justify-end mb-4">
          <ThemeToggle />
        </div>
        <div className="container mx-auto max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  );
}
