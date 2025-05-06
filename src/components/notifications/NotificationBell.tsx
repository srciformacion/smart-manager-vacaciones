
import React from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNotifications } from "@/hooks/use-notifications";

export function NotificationBell() {
  const { unreadCount } = useNotifications();

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      className="relative"
      aria-label={`Notificaciones${unreadCount > 0 ? `, ${unreadCount} sin leer` : ''}`}
    >
      <Bell className="h-5 w-5" aria-hidden="true" />
      {unreadCount > 0 && (
        <span 
          className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-600 text-[10px] font-medium text-white flex items-center justify-center" 
          aria-hidden="true"
        >
          {unreadCount}
        </span>
      )}
    </Button>
  );
}
