
import { useState } from "react";
import { NotificationFormState } from "./types";
import { RecipientsSection } from "./RecipientsSection";
import { NotificationTypeSection } from "./NotificationTypeSection";
import { NotificationChannelSection } from "./NotificationChannelSection";
import { NotificationContentSection } from "./NotificationContentSection";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { sendNotification } from "@/services/notification";
import { toast } from "@/hooks/use-toast";
import { exampleWorkers } from "@/data/example-users";

export function NotificationForm() {
  const [form, setForm] = useState<NotificationFormState>({
    recipients: "",
    notificationType: "requestApproved",
    channel: "web",
    subject: "",
    message: ""
  });

  const [isSending, setIsSending] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState<string>("");

  const handleFormChange = (field: keyof NotificationFormState, value: string) => {
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
      
      if (selectedWorker === "all") {
        recipients = exampleWorkers.map(worker => worker.id);
      } else if (selectedWorker) {
        recipients = [selectedWorker];
      } else if (form.recipients) {
        recipients = form.recipients.split(",").map(email => email.trim());
      }

      for (const recipient of recipients) {
        const worker = exampleWorkers.find(w => w.id === recipient);
        
        await sendNotification({
          userId: worker?.id || recipient,
          title: form.subject,
          message: form.message,
          type: form.notificationType,
          channel: [form.channel],
          // For backwards compatibility
          canal: form.channel,
          titulo: form.subject,
          mensaje: form.message,
          tipo: form.notificationType,
          destino: worker?.email || recipient
        });
      }
      
      toast({
        title: "Notificaciones enviadas",
        description: `Se han enviado ${recipients.length} notificaciones correctamente.`,
      });
      
      setForm({
        recipients: "",
        notificationType: "requestApproved",
        channel: "web",
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
    <Card>
      <CardHeader>
        <CardTitle>Nueva notificación</CardTitle>
        <CardDescription>
          Configura y envía notificaciones a uno o varios trabajadores
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <RecipientsSection
          selectedWorker={selectedWorker}
          setSelectedWorker={setSelectedWorker}
          recipients={form.recipients}
          onRecipientsChange={(value) => handleFormChange("recipients", value)}
        />
        <NotificationTypeSection
          value={form.notificationType}
          onChange={(value) => handleFormChange("notificationType", value)}
        />
        <NotificationChannelSection
          value={form.channel}
          onChange={(value) => handleFormChange("channel", value)}
        />
        <NotificationContentSection
          subject={form.subject}
          message={form.message}
          onSubjectChange={(value) => handleFormChange("subject", value)}
          onMessageChange={(value) => handleFormChange("message", value)}
        />
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
  );
}
