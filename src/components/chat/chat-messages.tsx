
import { useEffect, useRef } from "react";
import { useChat } from "@/context/chat-context";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Paperclip } from "lucide-react";
import { exampleUser, exampleWorkers } from "@/data/example-users";

export function ChatMessages() {
  const { messages, activeConversation } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!activeConversation) return null;

  const conversation = messages.filter(message => {
    const participants = activeConversation.split("-")[1];
    return message.senderId === participants || message.receiverId === participants;
  });

  return (
    <div className="p-4 space-y-4">
      {conversation.map((message) => {
        const isCurrentUser = message.senderId === exampleUser.id;
        const sender = isCurrentUser 
          ? exampleUser 
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
                  {sender?.name}
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
