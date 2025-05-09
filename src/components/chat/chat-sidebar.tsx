
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useChat } from "@/context/chat-context";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { exampleWorkers } from "@/data/example-users";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageCircle, Plus, Users, Bell, Search, Settings } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ChatSidebarProps {
  className?: string;
}

export function ChatSidebar({ className }: ChatSidebarProps) {
  const { conversations, activeConversation, setActiveConversation, isLoading } = useChat();

  if (isLoading) {
    return (
      <div className={cn("h-full", className)}>
        <div className="p-4 flex items-center justify-between">
          <h2 className="font-bold text-white">La Rioja Chat</h2>
          <Plus className="h-5 w-5 text-white opacity-70 hover:opacity-100 cursor-pointer" />
        </div>
        <div className="px-3 pb-2">
          <div className="bg-slate-700/70 rounded p-1 flex items-center">
            <Search className="h-4 w-4 ml-1 text-slate-400" />
            <Input 
              placeholder="Buscar..." 
              className="border-0 bg-transparent h-7 text-sm text-white focus-visible:ring-0 focus-visible:ring-offset-0" 
            />
          </div>
        </div>
        <div className="mt-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-10 my-1 mx-2 rounded-md bg-slate-700/50" />
          ))}
        </div>
      </div>
    );
  }

  // Slack-style sidebar navigation items
  const sidebarNavItems = [
    { icon: MessageCircle, label: "Mensajes", active: true },
    { icon: Bell, label: "Notificaciones" },
    { icon: Users, label: "Menciones" },
    { icon: Settings, label: "Preferencias" }
  ];

  return (
    <div className={cn("h-full flex flex-col", className)}>
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <h2 className="font-bold text-white">La Rioja Chat</h2>
        <Plus className="h-5 w-5 text-white opacity-70 hover:opacity-100 cursor-pointer" />
      </div>
      
      {/* Search */}
      <div className="px-3 pb-2">
        <div className="bg-slate-700/70 rounded p-1 flex items-center">
          <Search className="h-4 w-4 ml-1 text-slate-400" />
          <Input 
            placeholder="Buscar..." 
            className="border-0 bg-transparent h-7 text-sm text-white focus-visible:ring-0 focus-visible:ring-offset-0" 
          />
        </div>
      </div>
      
      {/* Navigation */}
      <div className="pt-2 px-2">
        {sidebarNavItems.map((item, index) => (
          <div 
            key={index} 
            className={cn(
              "flex items-center px-2 py-1 rounded-md mb-1 cursor-pointer",
              item.active ? "bg-slate-600" : "hover:bg-slate-700"
            )}
          >
            <item.icon className="h-4 w-4 mr-2 text-slate-400" />
            <span className="text-sm">{item.label}</span>
          </div>
        ))}
      </div>
      
      {/* Chats section */}
      <div className="mt-4 px-2">
        <div className="flex items-center justify-between px-2 py-1">
          <span className="text-xs font-semibold uppercase text-slate-400">Contactos</span>
          <Plus className="h-4 w-4 text-slate-400 hover:text-white cursor-pointer" />
        </div>
      </div>
      
      {/* Conversations list */}
      <ScrollArea className="flex-1 px-2 mt-1">
        {conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-4 text-slate-400 text-center">
            <MessageCircle className="h-12 w-12 mb-2 text-slate-600" />
            <p className="text-sm">No hay conversaciones disponibles</p>
            <Button variant="outline" size="sm" className="mt-2 bg-slate-700 text-white border-slate-600 hover:bg-slate-600">
              <Plus className="h-4 w-4 mr-2" />
              Nueva conversación
            </Button>
          </div>
        ) : (
          <div className="space-y-1">
            {conversations.map((conversation) => {
              const worker = exampleWorkers.find(w => 
                conversation.participants.includes(w.id)
              );
              
              if (!worker) return null;

              const isActive = activeConversation === conversation.id;

              return (
                <div
                  key={conversation.id}
                  onClick={() => setActiveConversation(conversation.id)}
                  className={cn(
                    "flex items-center p-2 rounded-md cursor-pointer",
                    isActive 
                      ? "bg-indigo-600 text-white" 
                      : "hover:bg-slate-700"
                  )}
                >
                  <div className="w-7 h-7 rounded-sm bg-slate-600 flex items-center justify-center mr-2 text-white font-medium text-xs">
                    {worker.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-medium truncate">{worker.name}</span>
                    {conversation.lastMessage && (
                      <span className="text-xs opacity-70 truncate">
                        {conversation.lastMessage.content.substring(0, 20)}
                        {conversation.lastMessage.content.length > 20 ? '...' : ''}
                      </span>
                    )}
                  </div>
                  {conversation.lastMessage && (
                    <span className="text-xs opacity-70 ml-auto pl-1">
                      {format(new Date(conversation.lastMessage.timestamp), "HH:mm", { locale: es })}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </ScrollArea>
      
      {/* User status - bottom of sidebar */}
      <div className="border-t border-slate-700 p-3">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-sm bg-indigo-600 flex items-center justify-center mr-2 text-white font-medium">
            LR
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium">La Rioja Cuida</span>
            <span className="text-xs text-slate-400">Activo</span>
          </div>
        </div>
      </div>
    </div>
  );
}
