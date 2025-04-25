
import { NotificationPayload } from "@/types";
import { sendNotification } from "@/services/notificationService";

// Ejemplo de notificación por solicitud aprobada
export const notifyVacationApproved = (
  userId: string,
  userEmail: string,
  userPhone: string,
  startDate: string,
  endDate: string
): Promise<boolean> => {
  const title = "Solicitud de vacaciones aprobada";
  const message = `Tu solicitud de vacaciones del ${startDate} al ${endDate} ha sido aprobada.`;
  
  // Obtener el canal preferido del usuario (en un entorno real esto vendría de la base de datos)
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const preferredChannel = user.preferredNotificationChannel || 'web';
  
  let destination = '';
  if (preferredChannel === 'email') {
    destination = userEmail;
  } else if (preferredChannel === 'whatsapp') {
    destination = userPhone;
  } else {
    destination = userId;
  }
  
  return sendNotification({
    canal: preferredChannel,
    destino: destination,
    titulo: title,
    mensaje: message,
    tipo: 'requestApproved',
    userId
  });
};

// Ejemplo de notificación por cambio de turno
export const notifyShiftAssigned = (
  userId: string,
  userEmail: string,
  userPhone: string,
  date: string,
  shift: string
): Promise<boolean> => {
  const title = "Nuevo turno asignado";
  const message = `Se te ha asignado un nuevo turno "${shift}" para el ${date}.`;
  
  // Obtener el canal preferido del usuario (en un entorno real esto vendría de la base de datos)
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const preferredChannel = user.preferredNotificationChannel || 'web';
  
  let destination = '';
  if (preferredChannel === 'email') {
    destination = userEmail;
  } else if (preferredChannel === 'whatsapp') {
    destination = userPhone;
  } else {
    destination = userId;
  }
  
  return sendNotification({
    canal: preferredChannel,
    destino: destination,
    titulo: title,
    mensaje: message,
    tipo: 'shiftAssigned',
    userId
  });
};

// Ejemplo de notificación por cambio de calendario
export const notifyCalendarChanged = (
  userId: string,
  userEmail: string,
  userPhone: string,
  month: string
): Promise<boolean> => {
  const title = "Calendario actualizado";
  const message = `Tu calendario laboral para ${month} ha sido actualizado. Por favor revisa los cambios.`;
  
  // Obtener el canal preferido del usuario (en un entorno real esto vendría de la base de datos)
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const preferredChannel = user.preferredNotificationChannel || 'web';
  
  let destination = '';
  if (preferredChannel === 'email') {
    destination = userEmail;
  } else if (preferredChannel === 'whatsapp') {
    destination = userPhone;
  } else {
    destination = userId;
  }
  
  return sendNotification({
    canal: preferredChannel,
    destino: destination,
    titulo: title,
    mensaje: message,
    tipo: 'calendarChanged',
    userId
  });
};

// Ejemplo de notificación por mensaje nuevo en el chat
export const notifyChatMessage = (
  userId: string,
  userEmail: string,
  userPhone: string,
  sender: string
): Promise<boolean> => {
  const title = "Nuevo mensaje en el chat";
  const message = `Has recibido un nuevo mensaje de ${sender} en el chat.`;
  
  // Obtener el canal preferido del usuario (en un entorno real esto vendría de la base de datos)
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const preferredChannel = user.preferredNotificationChannel || 'web';
  
  let destination = '';
  if (preferredChannel === 'email') {
    destination = userEmail;
  } else if (preferredChannel === 'whatsapp') {
    destination = userPhone;
  } else {
    destination = userId;
  }
  
  return sendNotification({
    canal: preferredChannel,
    destino: destination,
    titulo: title,
    mensaje: message,
    tipo: 'chatMessage',
    userId
  });
};

// Ejemplo de notificación por recordatorio de documento
export const notifyDocumentReminder = (
  userId: string,
  userEmail: string,
  userPhone: string,
  documentName: string,
  dueDate: string
): Promise<boolean> => {
  const title = "Recordatorio de documento pendiente";
  const message = `Recuerda que debes presentar "${documentName}" antes del ${dueDate}.`;
  
  // Obtener el canal preferido del usuario (en un entorno real esto vendría de la base de datos)
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const preferredChannel = user.preferredNotificationChannel || 'web';
  
  let destination = '';
  if (preferredChannel === 'email') {
    destination = userEmail;
  } else if (preferredChannel === 'whatsapp') {
    destination = userPhone;
  } else {
    destination = userId;
  }
  
  return sendNotification({
    canal: preferredChannel,
    destino: destination,
    titulo: title,
    mensaje: message,
    tipo: 'documentReminder',
    userId
  });
};
