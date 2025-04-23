
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { sendEmailNotification } from "@/utils/emailService";
import { NotificationType, User, Request } from "@/types";
import { useToast } from "@/hooks/use-toast";

export function NotificationTester() {
  const { toast } = useToast();
  const [notificationType, setNotificationType] = useState<NotificationType>("requestCreated");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [sendWhatsApp, setSendWhatsApp] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // Datos de ejemplo para la notificación
  const testUser: User = {
    id: "test-user",
    name: "Usuario de Prueba",
    surname: "Apellido Prueba",
    email: email || "test@example.com",
    role: "worker",
    shift: "Programado",
    workGroup: "Grupo Programado",
    workday: "Completa",
    department: "Atención al cliente",
    seniority: 2,
    phone: phone || undefined
  };

  const testRequest: Request = {
    id: "test-request",
    userId: "test-user",
    type: "vacation",
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Una semana después
    reason: "Solicitud de prueba",
    status: "pending",
    createdAt: new Date(),
    updatedAt: new Date(),
    observations: notificationType === "requestRejected" ? "Motivo de rechazo de prueba" : 
                  notificationType === "requestMoreInfo" ? "Se requiere documentación adicional" : 
                  undefined
  };

  const handleSendTest = async () => {
    setIsSending(true);
    try {
      const success = await sendEmailNotification(
        notificationType,
        testRequest,
        testUser,
        email || undefined,
        sendWhatsApp
      );

      if (success) {
        toast({
          title: "Notificación enviada",
          description: `Se ha enviado correctamente la notificación de tipo: ${notificationType}`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudo enviar la notificación. Revise la consola para más detalles.",
        });
      }
    } catch (error) {
      console.error("Error al enviar notificación de prueba:", error);
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
        <CardTitle>Probador de notificaciones</CardTitle>
        <CardDescription>
          Envía notificaciones de prueba para verificar la configuración de emails y WhatsApp
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
          <Label htmlFor="email">Email de prueba (opcional)</Label>
          <Input
            id="email"
            type="email"
            placeholder="ejemplo@correo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Si se deja en blanco, se usará el email del usuario de prueba
          </p>
        </div>

        <div className="flex items-start space-x-2">
          <Checkbox 
            id="send-whatsapp" 
            checked={sendWhatsApp} 
            onCheckedChange={(checked) => setSendWhatsApp(checked === true)}
          />
          <div className="grid gap-1.5 leading-none">
            <Label
              htmlFor="send-whatsapp"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Enviar también por WhatsApp
            </Label>
            <p className="text-xs text-muted-foreground">
              Se enviará un mensaje de WhatsApp si se proporciona un número de teléfono
            </p>
          </div>
        </div>

        {sendWhatsApp && (
          <div className="space-y-2">
            <Label htmlFor="phone">Número de teléfono (con prefijo del país)</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+34600000000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Formato: +34XXXXXXXXX (incluir el prefijo del país)
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSendTest} 
          disabled={isSending}
        >
          {isSending ? "Enviando..." : "Enviar notificación de prueba"}
        </Button>
      </CardFooter>
    </Card>
  );
}
