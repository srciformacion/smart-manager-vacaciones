
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useChat } from "@/context/chat-context";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { exampleWorkers } from "@/data/example-users";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageCircle } from "lucide-react";

interface ChatSidebarProps {
  className?: string;
}

export function ChatSidebar({ className }: ChatSidebarProps) {
  const { conversations, activeConversation, setActiveConversation, isLoading } = useChat();

  if (isLoading) {
    return (
      <div className={cn("h-full", className)}>
        <div className="p-4 border-b">
          <Skeleton className="h-6 w-24" />
        </div>
        <div className="p-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-14 mb-2 rounded-md" />
          ))}
        </div>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className={cn("h-full flex flex-col items-center justify-center p-4", className)}>
        <MessageCircle className="h-12 w-12 text-muted-foreground mb-2" />
        <p className="text-center text-muted-foreground">No hay conversaciones disponibles</p>
      </div>
    );
  }

  return (
    <div className={cn("h-full", className)}>
      <div className="p-4 border-b">
        <h2 className="font-semibold">Chats</h2>
      </div>
      <ScrollArea className="h-[calc(100%-4rem)]">
        <div className="p-2">
          {conversations.map((conversation) => {
            const worker = exampleWorkers.find(w => 
              conversation.participants.includes(w.id)
            );
            if (!worker) return null;

            const isActive = activeConversation === conversation.id;

            return (
              <Button
                key={conversation.id}
                variant={isActive ? "secondary" : "ghost"}
                className="w-full justify-start mb-1"
                onClick={() => setActiveConversation(conversation.id)}
                aria-pressed={isActive}
              >
                <div className="flex flex-col items-start">
                  <span>{worker.name}</span>
                  {conversation.lastMessage && (
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(conversation.lastMessage.timestamp), "dd MMM, HH:mm", { locale: es })}
                    </span>
                  )}
                </div>
              </Button>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
