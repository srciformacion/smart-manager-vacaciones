
import { useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { NotificationPayload, NotificationType, User } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Mail, MessageSquare, Bell } from "lucide-react";
import { sendNotification } from "@/services/notificationService";
import { exampleWorkers } from "@/data/example-users";
import { toast } from "@/hooks/use-toast";

// Tipos para esta página
interface FormState {
  recipients: string;
  notificationType: NotificationType;
  channel: 'web' | 'email' | 'whatsapp' | 'preferred';
  subject: string;
  message: string;
}

export default function SendNotificationPage() {
  const [user, setUser] = useState<User | null>(() => {
    const userJson = localStorage.getItem("user");
    return userJson ? JSON.parse(userJson) : null;
  });

  const [form, setForm] = useState<FormState>({
    recipients: "",
    notificationType: "requestApproved",
    channel: "preferred",
    subject: "",
    message: ""
  });

  const [isSending, setIsSending] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState<string>("");

  const handleFormChange = (field: keyof FormState, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSendNotification = async () => {
    if (!form.subject || !form.message || (!form.recipients && !selectedWorker)) {
      toast({
        variant: "destructive",
        title: "Campos incompletos",
        description: "Por favor complete todos los campos antes de enviar la notificación.",
      });
      return;
    }

    setIsSending(true);
    
    try {
      let recipients: string[] = [];
      
      // Determinar los destinatarios
      if (selectedWorker === "all") {
        recipients = exampleWorkers.map(worker => worker.id);
      } else if (selectedWorker) {
        recipients = [selectedWorker];
      } else if (form.recipients) {
        recipients = form.recipients.split(",").map(email => email.trim());
      }

      // Enviar notificaciones a cada destinatario
      for (const recipient of recipients) {
        // Buscar el trabajador en los datos de ejemplo (en un entorno real sería de la base de datos)
        const worker = exampleWorkers.find(w => w.id === recipient);
        
        // Si no encontramos al trabajador pero tenemos un email, asumimos que es un email externo
        if (!worker && recipient.includes('@')) {
          await sendNotification({
            canal: form.channel === 'preferred' ? 'email' : form.channel,
            destino: recipient,
            titulo: form.subject,
            mensaje: form.message,
            tipo: form.notificationType
          });
          continue;
        }
        
        if (!worker) continue;
        
        // Determinar el canal y destino según las preferencias
        let canal = form.channel;
        let destino = recipient;
        
        if (canal === 'preferred') {
          // Consultar el canal preferido del trabajador (simulado)
          const userData = JSON.parse(localStorage.getItem('user') || '{}');
          canal = userData.preferredNotificationChannel || 'web';
        }
        
        if (canal === 'email') {
          destino = worker.email;
        } else if (canal === 'whatsapp') {
          destino = worker.phone || '';
        }
        
        await sendNotification({
          canal,
          destino,
          titulo: form.subject,
          mensaje: form.message,
          tipo: form.notificationType,
          userId: worker.id
        });
      }
      
      toast({
        title: "Notificaciones enviadas",
        description: `Se han enviado ${recipients.length} notificaciones correctamente.`,
      });
      
      // Resetear formulario
      setForm({
        recipients: "",
        notificationType: "requestApproved",
        channel: "preferred",
        subject: "",
        message: ""
      });
      setSelectedWorker("");
      
    } catch (error) {
      console.error("Error al enviar notificaciones:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ha ocurrido un error al enviar las notificaciones.",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <MainLayout user={user}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Envío de notificaciones</h1>
            <p className="text-muted-foreground mt-2">
              Gestiona el envío de notificaciones a trabajadores a través de diferentes canales
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Nueva notificación</CardTitle>
            <CardDescription>
              Configura y envía notificaciones a uno o varios trabajadores
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Selección de destinatarios */}
            <div className="space-y-2">
              <Label>Destinatarios</Label>
              <Select 
                value={selectedWorker} 
                onValueChange={setSelectedWorker}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar destinatario" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="all">Todos los trabajadores</SelectItem>
                    {exampleWorkers.map(worker => (
                      <SelectItem key={worker.id} value={worker.id}>
                        {worker.name} - {worker.department}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              
              <p className="text-xs text-muted-foreground mt-1">O introduce direcciones de correo electrónico separadas por comas</p>
              <Input
                placeholder="ejemplo@email.com, otro@email.com"
                disabled={!!selectedWorker}
                value={form.recipients}
                onChange={(e) => handleFormChange("recipients", e.target.value)}
              />
            </div>

            {/* Tipo de notificación */}
            <div className="space-y-2">
              <Label>Tipo de notificación</Label>
              <Select 
                value={form.notificationType} 
                onValueChange={(value) => handleFormChange("notificationType", value as NotificationType)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="requestApproved">Solicitud aprobada</SelectItem>
                  <SelectItem value="requestRejected">Solicitud rechazada</SelectItem>
                  <SelectItem value="shiftAssigned">Nuevo turno asignado</SelectItem>
                  <SelectItem value="calendarChanged">Cambio en calendario</SelectItem>
                  <SelectItem value="chatMessage">Mensaje de chat</SelectItem>
                  <SelectItem value="documentReminder">Recordatorio de documento</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Canal de envío */}
            <div className="space-y-2">
              <Label>Canal de envío</Label>
              <RadioGroup 
                value={form.channel} 
                onValueChange={(value) => handleFormChange("channel", value as 'web' | 'email' | 'whatsapp' | 'preferred')}
                className="flex gap-8"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="preferred" id="preferred" />
                  <Label htmlFor="preferred" className="flex items-center gap-1">
                    Canal preferido del usuario
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="web" id="web" />
                  <Label htmlFor="web" className="flex items-center gap-1">
                    Web <Bell className="h-4 w-4" />
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="email" id="email" />
                  <Label htmlFor="email" className="flex items-center gap-1">
                    Email <Mail className="h-4 w-4" />
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="whatsapp" id="whatsapp" />
                  <Label htmlFor="whatsapp" className="flex items-center gap-1">
                    WhatsApp <MessageSquare className="h-4 w-4" />
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Asunto y mensaje */}
            <div className="space-y-2">
              <Label htmlFor="subject">Asunto</Label>
              <Input
                id="subject"
                value={form.subject}
                onChange={(e) => handleFormChange("subject", e.target.value)}
                placeholder="Asunto de la notificación"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Mensaje</Label>
              <Textarea
                id="message"
                value={form.message}
                onChange={(e) => handleFormChange("message", e.target.value)}
                placeholder="Escribe el contenido de la notificación..."
                rows={5}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full sm:w-auto" 
              onClick={handleSendNotification}
              disabled={isSending || !form.subject || !form.message || (!form.recipients && !selectedWorker)}
            >
              {isSending ? "Enviando..." : "Enviar notificación"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </MainLayout>
  );
}
