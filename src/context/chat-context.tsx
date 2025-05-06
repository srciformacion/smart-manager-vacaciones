
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { useProfileAuth } from "@/hooks/profile/useProfileAuth";
import { toast } from "sonner";
import { ChatMessage, ChatConversation } from "@/types/chat";

// Mock data for initial chat conversations and messages
const exampleMessages: ChatMessage[] = [];
const exampleConversations: ChatConversation[] = [];

interface ChatContextType {
  messages: ChatMessage[];
  conversations: ChatConversation[];
  activeConversation: string | null;
  setActiveConversation: (id: string | null) => void;
  sendMessage: (content: string, receiverId: string, attachmentName?: string) => void;
  isLoading: boolean;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { user } = useProfileAuth();

  // Load chat data on component mount
  useEffect(() => {
    const loadChatData = () => {
      // Try to load from localStorage first for persistence
      try {
        const storedMessages = localStorage.getItem('chat-messages');
        const storedConversations = localStorage.getItem('chat-conversations');
        
        if (storedMessages && storedConversations) {
          setMessages(JSON.parse(storedMessages));
          setConversations(JSON.parse(storedConversations));
        } else {
          // Fallback to example data if nothing in localStorage
          setMessages(exampleMessages);
          setConversations(exampleConversations);
        }
      } catch (error) {
        console.error("Error loading chat data:", error);
        // Fallback to example data
        setMessages(exampleMessages);
        setConversations(exampleConversations);
      }
      
      setIsLoading(false);
    };
    
    loadChatData();
  }, []);

  // Save chat data when it changes
  useEffect(() => {
    if (!isLoading && messages.length > 0) {
      localStorage.setItem('chat-messages', JSON.stringify(messages));
    }
  }, [messages, isLoading]);

  useEffect(() => {
    if (!isLoading && conversations.length > 0) {
      localStorage.setItem('chat-conversations', JSON.stringify(conversations));
    }
  }, [conversations, isLoading]);

  const sendMessage = (content: string, receiverId: string, attachmentName?: string) => {
    if (!content.trim() && !attachmentName) {
      toast.error("No se puede enviar un mensaje vacío");
      return;
    }
    
    const currentUserId = user?.id || "demo-user";
    
    const newMessage: ChatMessage = {
      id: uuidv4(),
      content: content.trim(),
      senderId: currentUserId,
      receiverId,
      timestamp: new Date(),
      attachmentName,
    };

    setMessages(prev => [...prev, newMessage]);
    
    // Update last message in conversation
    setConversations(prev => 
      prev.map(conv => {
        if (conv.participants.includes(receiverId) && conv.participants.includes(currentUserId)) {
          return { ...conv, lastMessage: newMessage };
        }
        return conv;
      })
    );
    
    // Show toast confirmation
    toast.success("Mensaje enviado");
  };

  return (
    <ChatContext.Provider 
      value={{ 
        messages, 
        conversations, 
        activeConversation, 
        setActiveConversation, 
        sendMessage,
        isLoading
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
