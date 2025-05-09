
import { User, UserRole } from "@/types";

export interface SidebarNavigationProps {
  user: User | null;
  role?: UserRole;
  collapsed?: boolean;
  onLogout?: () => Promise<void>;
  onNavigate?: () => void;
  onClose?: () => void;
  onCollapse?: () => void;
}

export interface SidebarLinkItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  ariaLabel: string;
}
