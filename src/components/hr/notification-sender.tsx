
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { sendNotification } from "@/services/notification";
import { NotificationType } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";

export function NotificationSender() {
  const { toast } = useToast();
  const [notificationType, setNotificationType] = useState<NotificationType>("requestCreated");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [recipients, setRecipients] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSendNotification = async () => {
    if (!subject || !message || !recipients) {
      toast({
        variant: "destructive",
        title: "Campos incompletos",
        description: "Por favor complete todos los campos antes de enviar la notificación.",
      });
      return;
    }

    setIsSending(true);
    try {
      // Simular envío de notificación (implementación real usará sendEmailNotification)
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      toast({
        title: "Notificación enviada",
        description: `Se ha enviado correctamente la notificación a ${recipients.split(",").length} destinatarios.`,
      });
      
      // Resetear formulario después de enviar
      setSubject("");
      setMessage("");
    } catch (error) {
      console.error("Error al enviar notificación:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo enviar la notificación. Por favor, inténtelo de nuevo.",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Envío de notificaciones</CardTitle>
        <CardDescription>
          Envíe notificaciones a trabajadores o grupos de forma masiva
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="notification-type">Tipo de notificación</Label>
          <Select 
            value={notificationType} 
            onValueChange={(value) => setNotificationType(value as NotificationType)}
          >
            <SelectTrigger id="notification-type">
              <SelectValue placeholder="Seleccionar tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="requestCreated">Informativa general</SelectItem>
              <SelectItem value="requestApproved">Recordatorio</SelectItem>
              <SelectItem value="requestRejected">Urgente</SelectItem>
              <SelectItem value="requestMoreInfo">Cambio de política</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="recipients">Destinatarios</Label>
          <Input
            id="recipients"
            placeholder="emails separados por comas o 'todos'"
            value={recipients}
            onChange={(e) => setRecipients(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Ingrese direcciones de correo separadas por comas o escriba "todos" para enviar a todo el personal
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="subject">Asunto</Label>
          <Input
            id="subject"
            placeholder="Asunto de la notificación"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="message">Mensaje</Label>
          <Textarea
            id="message"
            placeholder="Escriba el contenido de la notificación..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={6}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSendNotification} 
          disabled={isSending || !subject || !message || !recipients}
        >
          {isSending ? "Enviando..." : "Enviar notificación"}
        </Button>
      </CardFooter>
    </Card>
  );
}
