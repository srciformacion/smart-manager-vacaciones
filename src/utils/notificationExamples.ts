
import { NotificationPayload, NotificationType } from "@/types";
import { sendNotification } from "@/services/notification";

// Example notification for approved vacation
export const notifyVacationApproved = (
  userId: string,
  userEmail: string,
  userPhone: string,
  startDate: string,
  endDate: string
): Promise<boolean> => {
  const title = "Solicitud de vacaciones aprobada";
  const message = `Tu solicitud de vacaciones del ${startDate} al ${endDate} ha sido aprobada.`;
  
  // Get user's preferred channel (in a real environment this would come from the database)
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
    userId,
    title,
    message,
    type: 'requestApproved',
    channel: [preferredChannel as any],
    // For backwards compatibility
    canal: preferredChannel as any,
    destino: destination,
    titulo: title,
    mensaje: message,
    tipo: 'requestApproved'
  });
};

// Example notification for shift assignment
export const notifyShiftAssigned = (
  userId: string,
  userEmail: string,
  userPhone: string,
  date: string,
  shift: string
): Promise<boolean> => {
  const title = "Nuevo turno asignado";
  const message = `Se te ha asignado un nuevo turno "${shift}" para el ${date}.`;
  
  // Get user's preferred channel (in a real environment this would come from the database)
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
    userId,
    title,
    message,
    type: 'requestApproved', // Using an existing type as fallback
    channel: [preferredChannel as any],
    // For backwards compatibility
    canal: preferredChannel as any,
    destino: destination,
    titulo: title,
    mensaje: message,
    tipo: 'requestApproved'
  });
};

// Example notification for calendar changes
export const notifyCalendarChanged = (
  userId: string,
  userEmail: string,
  userPhone: string,
  month: string
): Promise<boolean> => {
  const title = "Calendario actualizado";
  const message = `Tu calendario laboral para ${month} ha sido actualizado. Por favor revisa los cambios.`;
  
  // Get user's preferred channel (in a real environment this would come from the database)
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
    userId,
    title,
    message,
    type: 'requestApproved', // Using an existing type as fallback
    channel: [preferredChannel as any],
    // For backwards compatibility
    canal: preferredChannel as any,
    destino: destination,
    titulo: title,
    mensaje: message,
    tipo: 'requestApproved'
  });
};

// Example notification for new chat messages
export const notifyChatMessage = (
  userId: string,
  userEmail: string,
  userPhone: string,
  sender: string
): Promise<boolean> => {
  const title = "Nuevo mensaje en el chat";
  const message = `Has recibido un nuevo mensaje de ${sender} en el chat.`;
  
  // Get user's preferred channel (in a real environment this would come from the database)
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
    userId,
    title,
    message,
    type: 'requestApproved', // Using an existing type as fallback
    channel: [preferredChannel as any],
    // For backwards compatibility
    canal: preferredChannel as any,
    destino: destination,
    titulo: title,
    mensaje: message,
    tipo: 'requestApproved'
  });
};

// Example notification for document reminders
export const notifyDocumentReminder = (
  userId: string,
  userEmail: string,
  userPhone: string,
  documentName: string,
  dueDate: string
): Promise<boolean> => {
  const title = "Recordatorio de documento pendiente";
  const message = `Recuerda que debes presentar "${documentName}" antes del ${dueDate}.`;
  
  // Get user's preferred channel (in a real environment this would come from the database)
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
    userId,
    title,
    message,
    type: 'requestApproved', // Using an existing type as fallback
    channel: [preferredChannel as any],
    // For backwards compatibility
    canal: preferredChannel as any,
    destino: destination,
    titulo: title,
    mensaje: message,
    tipo: 'requestApproved'
  });
};
