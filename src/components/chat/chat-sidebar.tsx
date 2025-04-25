
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useChat } from "@/context/chat-context";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { exampleWorkers } from "@/data/example-users";

interface ChatSidebarProps {
  className?: string;
}

export function ChatSidebar({ className }: ChatSidebarProps) {
  const { conversations, activeConversation, setActiveConversation } = useChat();

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

            return (
              <Button
                key={conversation.id}
                variant={activeConversation === conversation.id ? "secondary" : "ghost"}
                className="w-full justify-start mb-1"
                onClick={() => setActiveConversation(conversation.id)}
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
