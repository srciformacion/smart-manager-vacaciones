
import { createContext, useContext, useState, ReactNode } from "react";
import { ChatMessage, ChatConversation } from "@/types/chat";
import { exampleMessages, exampleConversations } from "@/data/example-chats";
import { v4 as uuidv4 } from "uuid";

interface ChatContextType {
  messages: ChatMessage[];
  conversations: ChatConversation[];
  activeConversation: string | null;
  setActiveConversation: (id: string | null) => void;
  sendMessage: (content: string, receiverId: string, attachmentName?: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<ChatMessage[]>(exampleMessages);
  const [conversations, setConversations] = useState<ChatConversation[]>(exampleConversations);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);

  const sendMessage = (content: string, receiverId: string, attachmentName?: string) => {
    const newMessage: ChatMessage = {
      id: uuidv4(),
      content,
      senderId: "admin", // This should be the current user's ID
      receiverId,
      timestamp: new Date(),
      attachmentName,
    };

    setMessages(prev => [...prev, newMessage]);
    
    // Update last message in conversation
    setConversations(prev => 
      prev.map(conv => {
        if (conv.participants.includes(receiverId)) {
          return { ...conv, lastMessage: newMessage };
        }
        return conv;
      })
    );
  };

  return (
    <ChatContext.Provider 
      value={{ 
        messages, 
        conversations, 
        activeConversation, 
        setActiveConversation, 
        sendMessage 
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};

