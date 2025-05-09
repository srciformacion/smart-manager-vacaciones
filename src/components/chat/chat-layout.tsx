
import { useState } from "react";
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
        navigate('/');
      }
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex">
      {/* Slack-style sidebar */}
      <div className="w-60 bg-slate-800 text-white hidden md:block border-r border-slate-700">
        <ChatSidebar className="border-0" />
      </div>
      
      <div className="flex-1 flex flex-col">
        <div className="flex items-center p-4 border-b bg-white dark:bg-slate-900">
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
              <div className="h-full bg-slate-800 text-white">
                <ChatSidebar className="border-0" />
              </div>
            </SheetContent>
          </Sheet>
          <h2 className="text-lg font-semibold">
            {activeConversation ? "Conversación" : "La Rioja Cuida Chat"}
          </h2>
        </div>
        
        <div className="flex-1 flex">
          {activeConversation ? (
            <div className="flex-1 flex flex-col">
              <ScrollArea className="flex-1 p-4">
                <ChatMessages />
              </ScrollArea>
              <ChatInput className="p-4 border-t" />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full flex-1 text-muted-foreground">
              Selecciona una conversación para comenzar
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
