
import { useState } from "react";
import { useChat } from "@/context/chat-context";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Paperclip, Send, Smile, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  className?: string;
}

export function ChatInput({ className }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [attachment, setAttachment] = useState<string>("");
  const { activeConversation, sendMessage } = useChat();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() && !attachment) return;
    if (!activeConversation) return;

    const receiverId = activeConversation.split("-")[1];
    sendMessage(message.trim(), receiverId, attachment);
    
    setMessage("");
    setAttachment("");
  };

  const handleAttachment = () => {
    // Simulate file selection
    const fileName = "documento_adjunto.pdf";
    setAttachment(fileName);
  };

  return (
    <div className={cn("border-t", className)}>
      {attachment && (
        <div className="flex items-center gap-2 text-sm bg-slate-100 dark:bg-slate-800 p-2 m-2 rounded">
          <Paperclip className="h-4 w-4" />
          <span className="flex-1 truncate">{attachment}</span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setAttachment("")}
          >
            Eliminar
          </Button>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="flex flex-col">
        <div className="border-b p-2 flex gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleAttachment}
          >
            <PlusCircle className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleAttachment}
          >
            <Paperclip className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-end p-2 gap-2">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Mensaje..."
            className="min-h-[40px] max-h-32 resize-none"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          
          <div className="flex gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8"
            >
              <Smile className="h-4 w-4" />
            </Button>
            
            <Button 
              type="submit" 
              size="icon" 
              disabled={!message.trim() && !attachment}
              className="h-8 w-8 bg-indigo-600 hover:bg-indigo-700"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
