
import { useState, useRef, useEffect } from "react";
import { NotificationThread, ThreadMessage } from "@/hooks/hr/notifications/use-notification-threads";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Paperclip, Send, Clock, CheckCircle, X, Download, AlertCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { exampleWorkers } from "@/data/example-users";

interface ThreadDetailProps {
  threadId: string;
  threads: NotificationThread[];
  onBack: () => void;
  onSendMessage: (threadId: string, content: string, attachments?: any[]) => void;
  onCloseThread: (threadId: string) => void;
  currentUserId: string;
}

export function ThreadDetail({
  threadId,
  threads,
  onBack,
  onSendMessage,
  onCloseThread,
  currentUserId,
}: ThreadDetailProps) {
  const thread = threads.find((t) => t.id === threadId);
  const [newMessage, setNewMessage] = useState("");
  const [fileInputVisible, setFileInputVisible] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Users cache for avatar display
  const usersCache = exampleWorkers.reduce((cache: Record<string, any>, worker) => {
    cache[worker.id] = worker;
    return cache;
  }, {});

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [thread?.messages]);

  if (!thread) {
    return (
      <div className="flex h-[500px] items-center justify-center p-4 text-muted-foreground">
        No se encontró la conversación solicitada.
      </div>
    );
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() && selectedFiles.length === 0) return;

    // In real app we would upload files to a server and get URLs
    const attachments = selectedFiles.length > 0
      ? selectedFiles.map(file => ({
          name: file.name,
          url: URL.createObjectURL(file), // This is just for demo
          type: file.type
        }))
      : undefined;

    onSendMessage(threadId, newMessage, attachments);
    setNewMessage("");
    setSelectedFiles([]);
    setFileInputVisible(false);
  };

  // Get the names of the participants
  const participants = thread.participantIds.map((id) => usersCache[id]?.name || 'Usuario desconocido');

  // Function to determine the time format
  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return format(date, "HH:mm");
    } else {
      return format(date, "dd/MM/yyyy HH:mm");
    }
  };

  return (
    <div className="flex h-[580px] flex-col">
      <div className="flex items-center justify-between border-b p-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Volver</span>
          </Button>
          <div>
            <h3 className="font-medium">{thread.subject}</h3>
            <p className="text-sm text-muted-foreground">
              Con {participants.join(", ")}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant={
              thread.status === "open"
                ? "default"
                : thread.status === "pending"
                ? "secondary"
                : "outline"
            }
            className="flex items-center gap-1"
          >
            {thread.status === "open" ? (
              <Clock className="h-3 w-3" />
            ) : thread.status === "pending" ? (
              <AlertCircle className="h-3 w-3" />
            ) : (
              <CheckCircle className="h-3 w-3" />
            )}
            {thread.status === "open"
              ? "Abierto"
              : thread.status === "pending"
              ? "Pendiente"
              : "Cerrado"}
          </Badge>
          {thread.status !== "closed" && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm">
                  Cerrar
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>¿Cerrar esta conversación?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Una vez cerrada, la conversación se archivará y no se podrán añadir más mensajes.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={() => onCloseThread(thread.id)}>
                    Cerrar conversación
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {thread.messages.map((message, index) => {
            const isCurrentUser = message.senderId === currentUserId;
            const user = usersCache[message.senderId];
            const showDateSeparator =
              index > 0 &&
              new Date(message.timestamp).toDateString() !==
                new Date(thread.messages[index - 1].timestamp).toDateString();

            return (
              <div key={message.id}>
                {showDateSeparator && (
                  <div className="flex items-center my-3">
                    <Separator className="flex-1" />
                    <span className="px-2 text-xs text-muted-foreground">
                      {format(new Date(message.timestamp), "EEEE, d 'de' MMMM", {
                        locale: es,
                      })}
                    </span>
                    <Separator className="flex-1" />
                  </div>
                )}
                
                <div className={`flex gap-2 ${isCurrentUser ? "justify-end" : "justify-start"}`}>
                  {!isCurrentUser && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={user?.profilePic}
                        alt={message.senderName}
                      />
                      <AvatarFallback>
                        {message.senderName.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div
                    className={`flex max-w-[70%] flex-col ${
                      isCurrentUser ? "items-end" : "items-start"
                    }`}
                  >
                    <div
                      className={`rounded-lg p-3 ${
                        isCurrentUser
                          ? "bg-primary text-primary-foreground"
                          : "bg-accent"
                      }`}
                    >
                      {!isCurrentUser && (
                        <p className="font-medium text-sm mb-1">
                          {message.senderName}
                        </p>
                      )}
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      
                      {message.attachments && message.attachments.length > 0 && (
                        <div className="mt-2 space-y-2">
                          {message.attachments.map((attachment, i) => (
                            <div
                              key={i}
                              className={`flex items-center gap-2 rounded p-2 text-sm ${
                                isCurrentUser
                                  ? "bg-primary/80"
                                  : "bg-background/80"
                              }`}
                            >
                              <Paperclip className="h-3 w-3" />
                              <span className="flex-1 truncate">
                                {attachment.name}
                              </span>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-5 w-5"
                              >
                                <Download className="h-3 w-3" />
                                <span className="sr-only">Descargar</span>
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <p className="mt-1 text-xs text-muted-foreground">
                      {formatMessageTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {thread.status !== "closed" && (
        <div className="border-t p-4">
          {selectedFiles.length > 0 && (
            <div className="mb-2 flex flex-wrap gap-2">
              {selectedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-xs"
                >
                  <Paperclip className="h-3 w-3" />
                  <span className="max-w-[120px] truncate">{file.name}</span>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-4 w-4 p-0"
                    onClick={() => handleRemoveFile(index)}
                  >
                    <X className="h-3 w-3" />
                    <span className="sr-only">Eliminar</span>
                  </Button>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-2">
            <Button
              type="button"
              size="icon"
              variant="outline"
              onClick={() => {
                setFileInputVisible(true);
                setTimeout(() => fileInputRef.current?.click(), 0);
              }}
            >
              <Paperclip className="h-4 w-4" />
              <span className="sr-only">Adjuntar archivos</span>
            </Button>
            
            <Textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Escribe un mensaje..."
              className="min-h-[42px] flex-1"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            
            <Button type="button" onClick={handleSendMessage}>
              <Send className="h-4 w-4" />
              <span className="sr-only">Enviar</span>
            </Button>
          </div>

          {fileInputVisible && (
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              multiple
              onChange={handleFileChange}
            />
          )}
        </div>
      )}
    </div>
  );
}
