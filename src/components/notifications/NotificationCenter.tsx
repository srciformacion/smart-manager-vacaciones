
import { useState, useEffect } from "react";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { Notification } from "@/types";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [open, setOpen] = useState(false);

  // Cargar notificaciones desde localStorage
  useEffect(() => {
    const loadNotifications = () => {
      try {
        const notificationsData = localStorage.getItem('notifications');
        if (notificationsData) {
          const parsedNotifications = JSON.parse(notificationsData).map((n: any) => ({
            ...n,
            createdAt: new Date(n.createdAt)
          }));
          setNotifications(parsedNotifications);
          
          // Contar notificaciones no leídas
          const unread = parsedNotifications.filter((n: Notification) => !n.read).length;
          setUnreadCount(unread);
        }
      } catch (error) {
        console.error('Error al cargar notificaciones:', error);
      }
    };

    // Cargar al montar y cuando se dispare el evento de nuevas notificaciones
    loadNotifications();
    window.addEventListener('notification', loadNotifications);
    
    return () => {
      window.removeEventListener('notification', loadNotifications);
    };
  }, []);

  // Marcar notificaciones como leídas
  const markAsRead = (id: string) => {
    try {
      const updatedNotifications = notifications.map(n => {
        if (n.id === id) {
          return { ...n, read: true };
        }
        return n;
      });
      
      setNotifications(updatedNotifications);
      
      // Actualizar localStorage
      localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
      
      // Actualizar contador
      const unread = updatedNotifications.filter(n => !n.read).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error('Error al marcar notificación como leída:', error);
    }
  };

  // Marcar todas como leídas
  const markAllAsRead = () => {
    try {
      const updatedNotifications = notifications.map(n => ({ ...n, read: true }));
      setNotifications(updatedNotifications);
      
      // Actualizar localStorage
      localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
      
      // Actualizar contador
      setUnreadCount(0);
    } catch (error) {
      console.error('Error al marcar todas las notificaciones como leídas:', error);
    }
  };

  // Eliminar notificación
  const deleteNotification = (id: string) => {
    try {
      const updatedNotifications = notifications.filter(n => n.id !== id);
      setNotifications(updatedNotifications);
      
      // Actualizar localStorage
      localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
      
      // Actualizar contador
      const unread = updatedNotifications.filter(n => !n.read).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error('Error al eliminar notificación:', error);
    }
  };

  // Borrar todas las notificaciones
  const deleteAll = () => {
    setNotifications([]);
    setUnreadCount(0);
    localStorage.setItem('notifications', JSON.stringify([]));
  };

  // Obtener la clase de color según el tipo de notificación
  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'requestApproved':
        return 'bg-green-500/10 text-green-500';
      case 'requestRejected':
        return 'bg-red-500/10 text-red-500';
      case 'shiftAssigned':
      case 'calendarChanged':
        return 'bg-amber-500/10 text-amber-500';
      case 'chatMessage':
        return 'bg-blue-500/10 text-blue-500';
      case 'documentReminder':
        return 'bg-purple-500/10 text-purple-500';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-md w-full">
        <SheetHeader className="flex justify-between items-center flex-row">
          <SheetTitle>Notificaciones</SheetTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={markAllAsRead} disabled={unreadCount === 0}>
              Marcar todas como leídas
            </Button>
            <Button variant="ghost" size="sm" onClick={deleteAll} disabled={notifications.length === 0}>
              Borrar todas
            </Button>
          </div>
        </SheetHeader>
        
        <Tabs defaultValue="all" className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">
              Todas ({notifications.length})
            </TabsTrigger>
            <TabsTrigger value="unread">
              Sin leer ({unreadCount})
            </TabsTrigger>
            <TabsTrigger value="read">
              Leídas ({notifications.length - unreadCount})
            </TabsTrigger>
          </TabsList>
          
          {['all', 'unread', 'read'].map((tab) => (
            <TabsContent key={tab} value={tab} className="mt-2">
              <ScrollArea className="h-[500px]">
                {notifications.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No hay notificaciones
                  </div>
                )}
                
                {notifications
                  .filter(n => {
                    if (tab === 'all') return true;
                    if (tab === 'unread') return !n.read;
                    if (tab === 'read') return n.read;
                    return true;
                  })
                  .map((notification) => (
                    <Card 
                      key={notification.id} 
                      className={`mb-3 ${!notification.read ? 'border-l-4 border-l-blue-600' : ''}`}
                    >
                      <CardHeader className="p-3 pb-1">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-sm">{notification.title}</CardTitle>
                          <Badge className={getNotificationColor(notification.type)}>
                            {notification.type.replace('request', '').replace(/([A-Z])/g, ' $1').trim()}
                          </Badge>
                        </div>
                        <CardDescription className="text-xs">
                          {formatDistanceToNow(notification.createdAt, { addSuffix: true, locale: es })}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-3 pt-1">
                        <p className="text-sm">{notification.message}</p>
                      </CardContent>
                      <CardFooter className="p-3 pt-1 flex justify-end gap-2">
                        {!notification.read && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => markAsRead(notification.id)}
                          >
                            Marcar como leída
                          </Button>
                        )}
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => deleteNotification(notification.id)}
                        >
                          Eliminar
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
              </ScrollArea>
            </TabsContent>
          ))}
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
