
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { sendEmailNotification } from "@/utils/emailService";
import { NotificationType, User, Request } from "@/types";
import { useToast } from "@/hooks/use-toast";

export function NotificationSender() {
  const { toast } = useToast();
  const [notificationType, setNotificationType] = useState<NotificationType>("requestCreated");
  const [email, setEmail] = useState("");
  const [isSending, setIsSending] = useState(false);

  const testUser: User = {
    id: "notification-recipient",
    name: "Destinatario",
    email: email || "destinatario@empresa.com",
    role: "worker",
    shift: "Programado",
    workGroup: "Grupo Programado",
    workday: "Completa",
    department: "Atención al cliente",
    seniority: 2
  };

  const testRequest: Request = {
    id: "notification-request",
    userId: "notification-recipient",
    type: "vacation",
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    reason: "Solicitud de ejemplo",
    status: "pending",
    createdAt: new Date(),
    updatedAt: new Date(),
    observations: notificationType === "requestRejected" ? "Motivo de rechazo de ejemplo" : 
                  notificationType === "requestMoreInfo" ? "Se requiere documentación adicional" : 
                  undefined
  };

  const handleSendNotification = async () => {
    if (!email) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Por favor, ingrese un correo electrónico"
      });
      return;
    }

    setIsSending(true);
    try {
      const success = await sendEmailNotification(
        notificationType,
        testRequest,
        testUser
      );

      if (success) {
        toast({
          title: "Notificación enviada",
          description: `Se ha enviado correctamente la notificación a ${email}`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudo enviar la notificación. Revise la consola para más detalles.",
        });
      }
    } catch (error) {
      console.error("Error al enviar notificación:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error al enviar la notificación: " + (error as Error).message,
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Enviar notificación</CardTitle>
        <CardDescription>
          Envía notificaciones por correo electrónico a los trabajadores
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
              <SelectItem value="requestCreated">Nueva solicitud</SelectItem>
              <SelectItem value="requestApproved">Solicitud aprobada</SelectItem>
              <SelectItem value="requestRejected">Solicitud rechazada</SelectItem>
              <SelectItem value="requestMoreInfo">Solicitud requiere más información</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Correo electrónico del destinatario</Label>
          <Input
            id="email"
            type="email"
            placeholder="correo@empresa.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSendNotification} 
          disabled={isSending}
        >
          {isSending ? "Enviando..." : "Enviar notificación"}
        </Button>
      </CardFooter>
    </Card>
  );
}
