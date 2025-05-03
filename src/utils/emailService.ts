
import { User, Request, NotificationType as AppNotificationType } from "@/types";

// Tipos de notificación
export type NotificationType = 
  | "requestCreated" 
  | "requestApproved" 
  | "requestRejected" 
  | "requestMoreInfo"
  | "shiftAssigned"
  | "calendarChanged"
  | "chatMessage"
  | "documentReminder";

interface EmailPayload {
  to: string;
  subject: string;
  html: string;
  whatsapp?: boolean;
  phone?: string;
}

// Función para generar el contenido HTML del email según el tipo de notificación
const generateEmailContent = (
  type: NotificationType,
  request: Request,
  user: User
): { subject: string; html: string } => {
  const requestTypeNames = {
    vacation: "vacaciones",
    personalDay: "asuntos propios",
    leave: "permiso justificado",
    shiftChange: "cambio de turno",
  };
  
  const requestTypeName = requestTypeNames[request.type];
  const startDate = new Date(request.startDate).toLocaleDateString("es-ES");
  const endDate = new Date(request.endDate).toLocaleDateString("es-ES");
  
  switch (type) {
    case "requestCreated":
      return {
        subject: `Nueva solicitud de ${requestTypeName} - ${user.name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Nueva solicitud de ${requestTypeName}</h2>
            <p>Se ha registrado una nueva solicitud con los siguientes detalles:</p>
            <ul>
              <li><strong>Solicitante:</strong> ${user.name}</li>
              <li><strong>Tipo:</strong> ${requestTypeName}</li>
              <li><strong>Fecha inicio:</strong> ${startDate}</li>
              <li><strong>Fecha fin:</strong> ${endDate}</li>
              ${request.reason ? `<li><strong>Motivo:</strong> ${request.reason}</li>` : ''}
            </ul>
            <p>La solicitud está pendiente de revisión.</p>
          </div>
        `,
      };
    case "requestApproved":
      return {
        subject: `Solicitud de ${requestTypeName} aprobada`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Solicitud aprobada</h2>
            <p>Tu solicitud de ${requestTypeName} ha sido aprobada:</p>
            <ul>
              <li><strong>Tipo:</strong> ${requestTypeName}</li>
              <li><strong>Fecha inicio:</strong> ${startDate}</li>
              <li><strong>Fecha fin:</strong> ${endDate}</li>
            </ul>
            <p>No es necesario realizar ninguna acción adicional.</p>
          </div>
        `,
      };
    case "requestRejected":
      return {
        subject: `Solicitud de ${requestTypeName} rechazada`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Solicitud rechazada</h2>
            <p>Lamentamos informarte que tu solicitud de ${requestTypeName} ha sido rechazada:</p>
            <ul>
              <li><strong>Tipo:</strong> ${requestTypeName}</li>
              <li><strong>Fecha inicio:</strong> ${startDate}</li>
              <li><strong>Fecha fin:</strong> ${endDate}</li>
              ${request.observations ? `<li><strong>Motivo del rechazo:</strong> ${request.observations}</li>` : ''}
            </ul>
            <p>Puedes ponerte en contacto con el departamento de RRHH para más información.</p>
          </div>
        `,
      };
    case "requestMoreInfo":
      return {
        subject: `Se requiere más información para tu solicitud de ${requestTypeName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Información adicional requerida</h2>
            <p>Para poder procesar tu solicitud de ${requestTypeName}, necesitamos información adicional:</p>
            <ul>
              <li><strong>Tipo:</strong> ${requestTypeName}</li>
              <li><strong>Fecha inicio:</strong> ${startDate}</li>
              <li><strong>Fecha fin:</strong> ${endDate}</li>
              ${request.observations ? `<li><strong>Información solicitada:</strong> ${request.observations}</li>` : ''}
            </ul>
            <p>Por favor, ponte en contacto con el departamento de RRHH lo antes posible para proporcionar esta información.</p>
          </div>
        `,
      };
    case "shiftAssigned":
      return {
        subject: `Tarea asignada`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Tarea asignada</h2>
            <p>Se ha asignado una tarea a ti:</p>
            <ul>
              <li><strong>Tipo:</strong> ${requestTypeName}</li>
              <li><strong>Fecha inicio:</strong> ${startDate}</li>
              <li><strong>Fecha fin:</strong> ${endDate}</li>
            </ul>
            <p>Por favor, ponte en contacto con el departamento de RRHH para más información.</p>
          </div>
        `,
      };
    case "calendarChanged":
      return {
        subject: `Cambio en el calendario`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Cambio en el calendario</h2>
            <p>Se ha realizado un cambio en el calendario:</p>
            <ul>
              <li><strong>Tipo:</strong> ${requestTypeName}</li>
              <li><strong>Fecha inicio:</strong> ${startDate}</li>
              <li><strong>Fecha fin:</strong> ${endDate}</li>
            </ul>
            <p>Por favor, ponte en contacto con el departamento de RRHH para más información.</p>
          </div>
        `,
      };
    case "chatMessage":
      return {
        subject: `Mensaje en chat`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Mensaje en chat</h2>
            <p>Se ha recibido un mensaje en el chat:</p>
            <ul>
              <li><strong>Tipo:</strong> ${requestTypeName}</li>
              <li><strong>Fecha inicio:</strong> ${startDate}</li>
              <li><strong>Fecha fin:</strong> ${endDate}</li>
            </ul>
            <p>Por favor, ponte en contacto con el departamento de RRHH para más información.</p>
          </div>
        `,
      };
    case "documentReminder":
      return {
        subject: `Recordatorio de documento`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Recordatorio de documento</h2>
            <p>Se ha recibido un recordatorio de documento:</p>
            <ul>
              <li><strong>Tipo:</strong> ${requestTypeName}</li>
              <li><strong>Fecha inicio:</strong> ${startDate}</li>
              <li><strong>Fecha fin:</strong> ${endDate}</li>
            </ul>
            <p>Por favor, ponte en contacto con el departamento de RRHH para más información.</p>
          </div>
        `,
      };
    default:
      return {
        subject: `Actualización sobre tu solicitud de ${requestTypeName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Actualización de solicitud</h2>
            <p>Ha habido una actualización en tu solicitud de ${requestTypeName}:</p>
            <ul>
              <li><strong>Tipo:</strong> ${requestTypeName}</li>
              <li><strong>Fecha inicio:</strong> ${startDate}</li>
              <li><strong>Fecha fin:</strong> ${endDate}</li>
              <li><strong>Estado:</strong> ${request.status}</li>
            </ul>
          </div>
        `,
      };
  }
};

// Función principal para enviar notificaciones por email y WhatsApp
export const sendEmailNotification = async (
  type: NotificationType,
  request: Request,
  user: User,
  recipientEmail?: string,
  sendWhatsApp: boolean = false
): Promise<boolean> => {
  try {
    const { subject, html } = generateEmailContent(type, request, user);
    
    // En una implementación real, aquí conectarías con un servicio de envío de emails
    // como Nodemailer, SendGrid, AWS SES, etc.
    console.log("Simulando envío de email:", {
      to: recipientEmail || user.email,
      subject,
      html,
      whatsapp: sendWhatsApp,
      phone: user.phone
    });

    // Usar la API de notificaciones locales para mostrar una notificación al usuario
    // como forma de simular el envío de emails en esta versión sin backend
    if (typeof window !== 'undefined' && window.Notification && Notification.permission === 'granted') {
      new Notification(subject, { 
        body: `Para: ${recipientEmail || user.email}\n${html.replace(/<[^>]*>/g, '')}` 
      });
    }
    
    return true;
  } catch (error) {
    console.error("Error en sendEmailNotification:", error);
    return false;
  }
};
