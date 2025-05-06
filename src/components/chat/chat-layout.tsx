
import { useEffect, useRef, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatSidebar } from "./chat-sidebar";
import { ChatMessages } from "./chat-messages";
import { ChatInput } from "./chat-input";
import { useChat } from "@/context/chat-context";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function ChatLayout() {
  const { activeConversation, setActiveConversation } = useChat();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const handleGoBack = () => {
    if (activeConversation) {
      setActiveConversation(null);
    } else {
      const userRole = localStorage.getItem('userRole');
      if (userRole === 'hr') {
        navigate('/rrhh/dashboard');
      } else {
        navigate('/calendar');
      }
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex gap-4">
      <ChatSidebar className="w-64 hidden md:block" />
      <div className="flex-1 flex flex-col">
        {activeConversation ? (
          <>
            <div className="flex items-center p-4 border-b">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleGoBack}
                className="mr-4"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                <SheetTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="mr-4 md:hidden"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-[250px] sm:w-[300px]">
                  <ChatSidebar className="border-0" />
                </SheetContent>
              </Sheet>
              <h2 className="text-lg font-semibold">
                Conversación actual
              </h2>
            </div>
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
