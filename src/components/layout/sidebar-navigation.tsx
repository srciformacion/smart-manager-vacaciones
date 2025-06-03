
import { ChevronsLeft, ChevronsRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { User, UserRole } from "@/types";
import { workerLinks, hrLinks } from "./sidebar/navigation-links";
import { SidebarNav } from "./sidebar/sidebar-nav";
import { UserProfile } from "./sidebar/user-profile";
import { SidebarNavigationProps } from "./sidebar/types";

export function SidebarNavigation({
  user,
  role = "worker",
  collapsed = false,
  onLogout,
  onNavigate,
  onClose,
  onCollapse
}: SidebarNavigationProps) {
  // Ensure we're using the correct role - use specific role passed or fall back to defaults
  const effectiveRole = role || user?.role || "worker";
  const links = effectiveRole === "hr" ? hrLinks : workerLinks;
  
  console.log("SidebarNavigation rendering with role:", effectiveRole, "showing links:", links.map(l => l.name).join(", "));
  
  const handleNavigation = () => {
    if (onNavigate) onNavigate();
    if (onClose) onClose();
  };

  return (
    <div className={cn(
      "h-full flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className={cn(
        "flex h-14 items-center border-b border-sidebar-border px-4",
        collapsed ? "justify-center" : "justify-between"
      )}>
        {!collapsed && (
          <span className="text-lg font-bold text-sidebar-foreground text-center">
            La Rioja Cuida
          </span>
        )}
        {onCollapse && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onCollapse} 
            aria-label={collapsed ? "Expandir menú lateral" : "Contraer menú lateral"}
            className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            {collapsed ? (
              <ChevronsRight className="h-4 w-4" />
            ) : (
              <ChevronsLeft className="h-4 w-4" />
            )}
            <span className="sr-only">
              {collapsed ? "Expandir menú" : "Contraer menú"}
            </span>
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-auto py-2">
        <SidebarNav 
          links={links} 
          collapsed={collapsed} 
          onNavigate={handleNavigation} 
        />
      </div>

      <UserProfile 
        user={user} 
        role={effectiveRole as UserRole} 
        collapsed={collapsed} 
        onLogout={onLogout} 
        onNavigate={handleNavigation} 
      />
    </div>
  );
}
