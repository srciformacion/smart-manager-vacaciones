
import { useState } from "react";
import { NotificationThread } from "@/hooks/hr/notifications/use-notification-threads";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Plus, Clock, Mail, CheckCircle, Circle, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { NewThreadForm } from "./NewThreadForm";

interface ThreadsListProps {
  threads: NotificationThread[];
  loading: boolean;
  onSelectThread: (threadId: string) => void;
  currentUserId: string;
}

export function ThreadsList({
  threads,
  loading,
  onSelectThread,
  currentUserId,
}: ThreadsListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "open" | "closed" | "pending">("all");
  const [categoryFilter, setcategoryFilter] = useState<"all" | NotificationThread["category"]>("all");
  const [showNewThreadForm, setShowNewThreadForm] = useState(false);

  // Filter threads
  const filteredThreads = threads.filter((thread) => {
    const matchesSearch =
      searchQuery === "" ||
      thread.subject.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || thread.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || thread.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Sort threads by date (newest first)
  const sortedThreads = [...filteredThreads].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  if (showNewThreadForm) {
    return (
      <NewThreadForm
        onCancel={() => setShowNewThreadForm(false)}
      />
    );
  }

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Conversaciones</h3>
        <Button onClick={() => setShowNewThreadForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva conversación
        </Button>
      </div>

      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar conversaciones..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>

        <div className="flex gap-2">
          <Select
            value={statusFilter}
            onValueChange={(value: "all" | "open" | "closed" | "pending") => setStatusFilter(value)}
          >
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="open">Abiertos</SelectItem>
              <SelectItem value="pending">Pendientes</SelectItem>
              <SelectItem value="closed">Cerrados</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={categoryFilter}
            onValueChange={(value: any) => setcategoryFilter(value)}
          >
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="vacation">Vacaciones</SelectItem>
              <SelectItem value="shift">Turnos</SelectItem>
              <SelectItem value="reminder">Recordatorios</SelectItem>
              <SelectItem value="special">Especial</SelectItem>
              <SelectItem value="general">General</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <ScrollArea className="h-[460px] rounded-md border">
        {loading ? (
          <div className="space-y-4 p-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="flex gap-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
            ))}
          </div>
        ) : sortedThreads.length === 0 ? (
          <div className="flex h-full items-center justify-center p-4 text-center text-muted-foreground">
            <div>
              <Mail className="mx-auto h-12 w-12 opacity-20 mb-2" />
              <p>No hay conversaciones que coincidan con los filtros.</p>
              <Button 
                variant="link" 
                className="mt-2"
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("all");
                  setcategoryFilter("all");
                }}
              >
                Limpiar filtros
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-1 p-1">
            {sortedThreads.map((thread) => {
              // Check if the thread has unread messages for the current user
              const hasUnreadMessages = thread.messages.some(
                (msg) => msg.senderId !== currentUserId && !msg.read
              );

              // Get the last message
              const lastMessage = thread.messages[thread.messages.length - 1];

              return (
                <div
                  key={thread.id}
                  className={`flex cursor-pointer flex-col rounded-md p-3 transition-colors hover:bg-accent ${
                    hasUnreadMessages ? "bg-accent/40" : ""
                  }`}
                  onClick={() => onSelectThread(thread.id)}
                >
                  <div className="mb-1 flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {hasUnreadMessages && (
                        <span className="h-2 w-2 rounded-full bg-primary" />
                      )}
                      <h4 className="font-medium">{thread.subject}</h4>
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      {format(new Date(thread.updatedAt), "dd MMM", {
                        locale: es,
                      })}
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {lastMessage?.senderName}: {lastMessage?.content}
                  </p>

                  <div className="mt-2 flex items-center gap-2">
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
                        <Circle className="h-3 w-3" />
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

                    <Badge variant="secondary">
                      {thread.category === "vacation"
                        ? "Vacaciones"
                        : thread.category === "shift"
                        ? "Turnos"
                        : thread.category === "reminder"
                        ? "Recordatorio"
                        : thread.category === "special"
                        ? "Especial"
                        : "General"}
                    </Badge>

                    <span className="ml-auto text-xs text-muted-foreground">
                      {thread.messages.length} mensajes
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
