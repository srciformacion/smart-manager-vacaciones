
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { exampleWorkers } from "@/data/example-users";
import { NotificationThread } from "@/hooks/hr/notifications/use-notification-threads";
import { useNotificationThreads } from "@/hooks/hr/notifications/use-notification-threads";
import { exampleUser } from "@/data/example-users";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";

interface NewThreadFormProps {
  onCancel: () => void;
}

export function NewThreadForm({ onCancel }: NewThreadFormProps) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState<NotificationThread["category"]>("general");
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const { createThread } = useNotificationThreads(exampleUser);
  
  const handleSelectUser = (userId: string) => {
    setSelectedUserIds(prev => 
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };
  
  const handleSelectAll = () => {
    if (selectedUserIds.length === exampleWorkers.length) {
      setSelectedUserIds([]);
    } else {
      setSelectedUserIds(exampleWorkers.map(worker => worker.id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    
    if (!subject.trim()) {
      newErrors.subject = "El asunto es obligatorio";
    }
    
    if (!message.trim()) {
      newErrors.message = "El mensaje es obligatorio";
    }
    
    if (selectedUserIds.length === 0) {
      newErrors.recipients = "Debes seleccionar al menos un destinatario";
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Create the thread
    createThread(subject, message, selectedUserIds, category);
    
    // Go back to threads list
    onCancel();
  };
  
  // Group workers by department
  const departmentGroups: Record<string, typeof exampleWorkers> = {};
  exampleWorkers.forEach(worker => {
    if (!departmentGroups[worker.department]) {
      departmentGroups[worker.department] = [];
    }
    departmentGroups[worker.department].push(worker);
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <div className="flex items-center gap-2 mb-4">
        <Button type="button" variant="ghost" size="icon" onClick={onCancel}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h3 className="text-lg font-semibold">Nueva conversación</h3>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="category">Categoría</Label>
        <Select 
          value={category} 
          onValueChange={(value: NotificationThread["category"]) => setCategory(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecciona una categoría" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="vacation">Vacaciones</SelectItem>
            <SelectItem value="shift">Turnos</SelectItem>
            <SelectItem value="reminder">Recordatorio</SelectItem>
            <SelectItem value="special">Especial</SelectItem>
            <SelectItem value="general">General</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="subject">Asunto</Label>
        <Input
          id="subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Asunto de la conversación"
          className={errors.subject ? "border-red-500" : ""}
        />
        {errors.subject && <p className="text-sm text-red-500">{errors.subject}</p>}
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="recipients">Destinatarios</Label>
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            onClick={handleSelectAll}
          >
            {selectedUserIds.length === exampleWorkers.length ? "Deseleccionar todos" : "Seleccionar todos"}
          </Button>
        </div>
        
        <ScrollArea className="h-[150px] border rounded-md p-2">
          <div className="space-y-4">
            {Object.entries(departmentGroups).map(([department, workers]) => (
              <div key={department} className="space-y-1">
                <div className="font-medium text-sm">{department}</div>
                {workers.map(worker => (
                  <div key={worker.id} className="flex items-center space-x-2 pl-2">
                    <Checkbox 
                      id={`user-${worker.id}`}
                      checked={selectedUserIds.includes(worker.id)}
                      onCheckedChange={() => handleSelectUser(worker.id)}
                    />
                    <Label 
                      htmlFor={`user-${worker.id}`}
                      className="text-sm flex-1 cursor-pointer"
                    >
                      {worker.name}
                    </Label>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </ScrollArea>
        {errors.recipients && <p className="text-sm text-red-500">{errors.recipients}</p>}
        <p className="text-xs text-muted-foreground">
          Seleccionados: {selectedUserIds.length} trabajadores
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="message">Mensaje</Label>
        <Textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Escribe el mensaje inicial..."
          rows={5}
          className={errors.message ? "border-red-500" : ""}
        />
        {errors.message && <p className="text-sm text-red-500">{errors.message}</p>}
      </div>
      
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">Iniciar conversación</Button>
      </div>
    </form>
  );
}
