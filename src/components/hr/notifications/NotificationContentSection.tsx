
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { NotificationContentSectionProps } from "./types";

export function NotificationContentSection({ 
  subject, 
  message, 
  onSubjectChange, 
  onMessageChange 
}: NotificationContentSectionProps) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="subject">Asunto</Label>
        <Input
          id="subject"
          value={subject}
          onChange={(e) => onSubjectChange(e.target.value)}
          placeholder="Asunto de la notificación"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Mensaje</Label>
        <Textarea
          id="message"
          value={message}
          onChange={(e) => onMessageChange(e.target.value)}
          placeholder="Escribe el contenido de la notificación..."
          rows={5}
        />
      </div>
    </>
  );
}
