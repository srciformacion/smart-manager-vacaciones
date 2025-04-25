
import { NotificationPayload, NotificationType } from "@/types";
import { toast } from "@/hooks/use-toast";

/**
 * Clase principal para gestionar las notificaciones
 * Actúa como un dispatcher que determina el canal apropiado para enviar una notificación
 */
export class NotificationService {
  /**
   * Envía una notificación a través del canal especificado
   * @param notification Datos de la notificación a enviar
   */
  static async sendNotification(notification: NotificationPayload): Promise<boolean> {
    console.log(`Sending notification via ${notification.canal}:`, notification);
    
    try {
      switch (notification.canal) {
        case 'web':
          return await this.sendWebNotification(notification);
        case 'email':
          return await this.sendEmailNotification(notification);
        case 'whatsapp':
          return await this.sendWhatsAppNotification(notification);
        default:
          console.error('Canal de notificación no válido:', notification.canal);
          return false;
      }
    } catch (error) {
      console.error('Error al enviar notificación:', error);
      return false;
    }
  }

  /**
   * Guarda una notificación web en la "base de datos" (localStorage por ahora)
   */
  private static async sendWebNotification(notification: NotificationPayload): Promise<boolean> {
    try {
      // En un entorno real, esto sería una llamada a la API para almacenar en la base de datos
      const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
      
      const newNotification = {
        id: `notification-${Date.now()}`,
        userId: notification.userId || 'unknown',
        title: notification.titulo,
        message: notification.mensaje,
        type: notification.tipo || 'requestCreated',
        channel: 'web',
        status: 'pending',
        createdAt: new Date(),
        read: false
      };
      
      notifications.push(newNotification);
      localStorage.setItem('notifications', JSON.stringify(notifications));
      
      // Mostrar un toast para notificaciones en tiempo real (simulado)
      toast({
        title: notification.titulo,
        description: notification.mensaje,
      });
      
      // Disparar un evento para que los componentes se actualicen
      window.dispatchEvent(new Event('notification'));
      
      return true;
    } catch (error) {
      console.error('Error al enviar notificación web:', error);
      return false;
    }
  }

  /**
   * Preparado para enviar emails mediante un servicio externo
   * Actualmente simula el envío
   */
  private static async sendEmailNotification(notification: NotificationPayload): Promise<boolean> {
    try {
      // MOCK: En un entorno real, esto sería una llamada a un servicio de email como SendGrid
      console.log(`MOCK EMAIL SENT TO: ${notification.destino}`);
      console.log(`Subject: ${notification.titulo}`);
      console.log(`Body: ${notification.mensaje}`);
      
      toast({
        title: "Email enviado (simulado)",
        description: `A: ${notification.destino}`,
      });
      
      return true;
    } catch (error) {
      console.error('Error al enviar email:', error);
      return false;
    }
  }

  /**
   * Preparado para enviar mensajes de WhatsApp mediante un servicio externo
   * Actualmente simula el envío
   */
  private static async sendWhatsAppNotification(notification: NotificationPayload): Promise<boolean> {
    try {
      // MOCK: En un entorno real, esto sería una llamada a Twilio o WhatsApp Business API
      console.log(`MOCK WHATSAPP SENT TO: ${notification.destino}`);
      console.log(`Message: ${notification.titulo}: ${notification.mensaje}`);
      
      toast({
        title: "WhatsApp enviado (simulado)",
        description: `A: ${notification.destino}`,
      });
      
      return true;
    } catch (error) {
      console.error('Error al enviar WhatsApp:', error);
      return false;
    }
  }

  /**
   * Obtiene el canal preferido de notificación de un usuario
   */
  static async getPreferredChannel(userId: string): Promise<'web' | 'email' | 'whatsapp'> {
    // En un entorno real, esto sería una consulta a la base de datos
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      return user.preferredNotificationChannel || 'web';
    } catch (error) {
      console.error('Error al obtener canal de notificación preferido:', error);
      return 'web'; // Por defecto
    }
  }

  /**
   * Envía una notificación al canal preferido del usuario
   */
  static async sendToPreferredChannel(userId: string, title: string, message: string, type?: NotificationType): Promise<boolean> {
    try {
      // Obtener los datos del usuario
      const userJson = localStorage.getItem('user');
      if (!userJson) {
        console.error('Usuario no encontrado');
        return false;
      }
      
      const user = JSON.parse(userJson);
      const channel = user.preferredNotificationChannel || 'web';
      let destination = '';
      
      // Determinar el destino según el canal
      if (channel === 'email') {
        destination = user.email || '';
      } else if (channel === 'whatsapp') {
        destination = user.phone || '';
      } else {
        destination = user.id || '';
      }
      
      if (!destination) {
        console.error(`No se pudo determinar el destino para el canal ${channel}`);
        return false;
      }
      
      // Enviar la notificación por el canal preferido
      return await this.sendNotification({
        canal: channel,
        destino: destination,
        titulo: title,
        mensaje: message,
        tipo: type,
        userId: user.id
      });
    } catch (error) {
      console.error('Error al enviar notificación al canal preferido:', error);
      return false;
    }
  }
}

// Función global para enviar notificaciones (puede ser usada en cualquier parte de la aplicación)
export const sendNotification = (notification: NotificationPayload): Promise<boolean> => {
  return NotificationService.sendNotification(notification);
};
