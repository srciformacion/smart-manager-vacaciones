
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { SidebarLinkItem } from "./types";

interface SidebarNavProps {
  links: SidebarLinkItem[];
  collapsed: boolean;
  onNavigate?: () => void;
}

export function SidebarNav({ links, collapsed, onNavigate }: SidebarNavProps) {
  return (
    <nav className="grid items-start px-2 gap-1">
      {links.map((link) => (
        <NavLink
          key={link.href}
          to={link.href}
          className={(props) => cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            props.isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground",
            collapsed && "justify-center p-0 h-9 w-9",
          )}
          onClick={onNavigate}
          aria-label={link.ariaLabel}
        >
          <link.icon className={cn("h-4 w-4", collapsed ? "h-5 w-5" : "")} aria-hidden="true" />
          {!collapsed && <span>{link.name}</span>}
        </NavLink>
      ))}
    </nav>
  );
}
