
import { useState } from "react";
import { useChat } from "@/context/chat-context";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Paperclip, Send } from "lucide-react";
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
    <form onSubmit={handleSubmit} className={cn("space-y-4", className)}>
      {attachment && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Paperclip className="h-4 w-4" />
          <span>{attachment}</span>
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
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleAttachment}
        >
          <Paperclip className="h-4 w-4" />
        </Button>
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Escribe un mensaje..."
          className="min-h-[2.5rem] max-h-32"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
        <Button type="submit" size="icon" disabled={!message.trim() && !attachment}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}
