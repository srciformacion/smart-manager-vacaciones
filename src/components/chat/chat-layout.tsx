
import { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatSidebar } from "./chat-sidebar";
import { ChatMessages } from "./chat-messages";
import { ChatInput } from "./chat-input";
import { useChat } from "@/context/chat-context";

export function ChatLayout() {
  const { activeConversation } = useChat();
  
  return (
    <div className="h-[calc(100vh-4rem)] flex gap-4">
      <ChatSidebar className="w-64 hidden md:block" />
      <div className="flex-1 flex flex-col">
        {activeConversation ? (
          <>
            <ScrollArea className="flex-1">
              <ChatMessages />
            </ScrollArea>
            <ChatInput className="p-4 border-t" />
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Selecciona una conversación para comenzar
          </div>
        )}
      </div>
    </div>
  );
}
