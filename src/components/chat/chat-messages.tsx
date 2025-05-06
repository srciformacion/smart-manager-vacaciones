
import { useEffect, useRef, useState } from "react";
import { useChat } from "@/context/chat-context";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Paperclip } from "lucide-react";
import { exampleUser, exampleWorkers } from "@/data/example-users";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { useProfileAuth } from "@/hooks/profile/useProfileAuth";

export function ChatMessages() {
  const { messages, activeConversation, isLoading } = useChat();
  const { user } = useProfileAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [conversation, setConversation] = useState<Array<any>>([]);

  useEffect(() => {
    if (activeConversation && messages.length > 0) {
      // Extract participant IDs from the conversation ID
      const participants = activeConversation.split("-");
      const receiverId = participants[1];
      
      // Filter messages for this conversation
      const conversationMessages = messages.filter(message => 
        (message.senderId === receiverId && message.receiverId === (user?.id || "demo-user")) || 
        (message.senderId === (user?.id || "demo-user") && message.receiverId === receiverId)
      );
      
      setConversation(conversationMessages);
    } else {
      setConversation([]);
    }
  }, [activeConversation, messages, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation]);

  if (!activeConversation) {
    return null;
  }
  
  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className={`flex ${i % 2 === 0 ? "justify-start" : "justify-end"}`}>
            <Skeleton className={`h-16 ${i % 2 === 0 ? "w-2/3" : "w-1/2"} rounded-lg`} />
          </div>
        ))}
      </div>
    );
  }

  if (conversation.length === 0) {
    return (
      <div className="flex items-center justify-center h-full p-4">
        <p className="text-muted-foreground">No hay mensajes en esta conversación. ¡Envía el primero!</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {conversation.map((message) => {
        const isCurrentUser = message.senderId === (user?.id || "demo-user");
        const sender = isCurrentUser 
          ? (user || exampleUser)
          : exampleWorkers.find(w => w.id === message.senderId);

        return (
          <div
            key={message.id}
            className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
          >
            <div
              className={cn(
                "max-w-[80%] rounded-lg p-3",
                isCurrentUser 
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              )}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-sm">
                  {sender?.name || (isCurrentUser ? "Tú" : "Usuario")}
                </span>
                <span className="text-xs opacity-70">
                  {format(new Date(message.timestamp), "HH:mm", { locale: es })}
                </span>
              </div>
              <p>{message.content}</p>
              {message.attachmentName && (
                <div className="flex items-center gap-2 mt-2 text-sm">
                  <Paperclip className="h-4 w-4" />
                  <span>{message.attachmentName}</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
}
