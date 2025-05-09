
import { useEffect, useRef } from "react";
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

  // Filter messages for the active conversation
  const conversationMessages = activeConversation 
    ? messages.filter(message => 
        (message.receiverId === activeConversation.split("-")[1] && 
         message.senderId === (user?.id || "demo-user")) || 
        (message.senderId === activeConversation.split("-")[1] && 
         message.receiverId === (user?.id || "demo-user"))
      )
    : [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversationMessages]);

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

  if (conversationMessages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full p-4">
        <p className="text-muted-foreground">No hay mensajes en esta conversación. ¡Envía el primero!</p>
      </div>
    );
  }

  // Group messages by date
  const groupedMessages: { [key: string]: typeof conversationMessages } = {};
  
  conversationMessages.forEach((message) => {
    const date = format(new Date(message.timestamp), 'yyyy-MM-dd');
    if (!groupedMessages[date]) {
      groupedMessages[date] = [];
    }
    groupedMessages[date].push(message);
  });

  return (
    <div className="space-y-6">
      {Object.entries(groupedMessages).map(([date, dateMessages]) => (
        <div key={date} className="space-y-4">
          <div className="flex items-center justify-center">
            <div className="bg-slate-100 dark:bg-slate-800 text-xs text-muted-foreground px-2 py-1 rounded-md">
              {format(new Date(date), "EEEE, d 'de' MMMM", { locale: es })}
            </div>
          </div>
          
          {dateMessages.map((message, index) => {
            const isCurrentUser = message.senderId === (user?.id || "demo-user");
            const sender = isCurrentUser 
              ? (user || exampleUser)
              : exampleWorkers.find(w => w.id === message.senderId);
            
            // Check if the previous message was from the same sender
            const prevMessage = index > 0 ? dateMessages[index - 1] : null;
            const isSameSenderAsPrev = prevMessage && prevMessage.senderId === message.senderId;
            // Check if messages are within 2 minutes of each other
            const isCloseInTime = prevMessage && 
              new Date(message.timestamp).getTime() - new Date(prevMessage.timestamp).getTime() < 2 * 60 * 1000;
            
            // Only show sender info for the first message in a sequence
            const showSenderInfo = !isSameSenderAsPrev || !isCloseInTime;

            return (
              <div
                key={message.id}
                className={cn(
                  "flex gap-2",
                  isCurrentUser ? "justify-end" : "justify-start",
                  !showSenderInfo && "mt-1" // Less margin for grouped messages
                )}
              >
                {!isCurrentUser && showSenderInfo && (
                  <div className="w-8 h-8 rounded-sm bg-slate-200 dark:bg-slate-700 flex items-center justify-center flex-shrink-0 text-xs font-medium">
                    {sender?.name.substring(0, 2).toUpperCase() || "??"}
                  </div>
                )}
                
                <div className="max-w-[75%] flex flex-col">
                  {showSenderInfo && (
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium">
                        {isCurrentUser ? "Tú" : sender?.name || "Usuario"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(message.timestamp), "HH:mm", { locale: es })}
                      </span>
                    </div>
                  )}
                  
                  <div
                    className={cn(
                      "rounded-lg p-3",
                      isCurrentUser 
                        ? "bg-indigo-600 text-white ml-auto"
                        : "bg-slate-200 dark:bg-slate-800"
                    )}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    {message.attachmentName && (
                      <div className="flex items-center gap-2 mt-2 text-sm">
                        <Paperclip className="h-4 w-4" />
                        <span>{message.attachmentName}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {isCurrentUser && showSenderInfo && (
                  <div className="w-8 h-8 rounded-sm bg-indigo-600 flex items-center justify-center flex-shrink-0 text-white text-xs font-medium">
                    {sender?.name.substring(0, 2).toUpperCase() || "TÚ"}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}
