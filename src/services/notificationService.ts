
import { NotificationPayload, NotificationType, NotificationChannel } from "@/types";
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
    const channel = notification.channel?.[0] || notification.canal;
    console.log(`Sending notification via ${channel}:`, notification);
    
    try {
      switch (channel) {
        case 'web':
          return await this.sendWebNotification(notification);
        case 'email':
          return await this.sendEmailNotification(notification);
        case 'whatsapp':
          return await this.sendWhatsAppNotification(notification);
        default:
          console.error('Canal de notificación no válido:', channel);
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
        title: notification.title || notification.titulo || '',
        message: notification.message || notification.mensaje || '',
        type: notification.type || notification.tipo || 'requestCreated',
        channel: 'web',
        status: 'pending',
        createdAt: new Date(),
        read: false
      };
      
      notifications.push(newNotification);
      localStorage.setItem('notifications', JSON.stringify(notifications));
      
      // Mostrar un toast para notificaciones en tiempo real (simulado)
      toast({
        title: newNotification.title,
        description: newNotification.message,
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
      const destination = notification.destino || 'user@example.com';
      console.log(`MOCK EMAIL SENT TO: ${destination}`);
      console.log(`Subject: ${notification.title || notification.titulo || ''}`);
      console.log(`Body: ${notification.message || notification.mensaje || ''}`);
      
      toast({
        title: "Email enviado (simulado)",
        description: `A: ${destination}`,
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
      const destination = notification.destino || 'user-phone';
      console.log(`MOCK WHATSAPP SENT TO: ${destination}`);
      console.log(`Message: ${notification.title || notification.titulo || ''}: ${notification.message || notification.mensaje || ''}`);
      
      toast({
        title: "WhatsApp enviado (simulado)",
        description: `A: ${destination}`,
      });
      
      return true;
    } catch (error) {
      console.error('Error al enviar WhatsApp:', error);
      return false;
    }
  }

  /**
   * Obtiene los canales de notificación de un usuario
   */
  static async getNotificationChannels(userId: string): Promise<string[]> {
    // En un entorno real, esto sería una consulta a la base de datos
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      return user.notification_channels || [user.preferredNotificationChannel || 'web'];
    } catch (error) {
      console.error('Error al obtener canales de notificación:', error);
      return ['web']; // Por defecto
    }
  }

  /**
   * Verifica si el usuario ha dado consentimiento para notificaciones
   */
  static async hasNotificationConsent(userId: string): Promise<boolean> {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      return user.notification_consent === true;
    } catch (error) {
      console.error('Error al verificar consentimiento:', error);
      return false;
    }
  }

  /**
   * Envía notificaciones por todos los canales autorizados del usuario
   */
  static async sendToAllAuthorizedChannels(userId: string, title: string, message: string, type?: NotificationType): Promise<boolean[]> {
    try {
      // Verificar consentimiento
      const hasConsent = await this.hasNotificationConsent(userId);
      if (!hasConsent) {
        console.warn('El usuario no ha dado consentimiento para notificaciones');
        return [false];
      }
      
      // Obtener los datos del usuario
      const userJson = localStorage.getItem('user');
      if (!userJson) {
        console.error('Usuario no encontrado');
        return [false];
      }
      
      const user = JSON.parse(userJson);
      const channels = user.notification_channels || [user.preferredNotificationChannel || 'web'];
      
      // Enviar notificaciones por cada canal
      const results = await Promise.all(channels.map(async (channel: string) => {
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
        
        // Asegurar que channel es uno de los tipos válidos antes de la asignación
        const validChannel = channel as NotificationChannel;
        
        // Enviar la notificación por el canal
        return await this.sendNotification({
          canal: validChannel,
          destino: destination,
          titulo: title,
          mensaje: message,
          tipo: type,
          userId: user.id
        });
      }));
      
      return results;
    } catch (error) {
      console.error('Error al enviar notificaciones:', error);
      return [false];
    }
  }

  /**
   * Obtiene el canal preferido de notificación de un usuario
   */
  static async getPreferredChannel(userId: string): Promise<NotificationChannel> {
    // En un entorno real, esto sería una consulta a la base de datos
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const preferredChannel = user.preferredNotificationChannel || 'web';
      // Asegurar que el valor devuelto es de tipo NotificationChannel
      if (preferredChannel !== 'web' && preferredChannel !== 'email' && preferredChannel !== 'whatsapp') {
        return 'web'; // Devolvemos un valor por defecto si no es un tipo válido
      }
      return preferredChannel as NotificationChannel;
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
      // Asegurar que channel es uno de los tipos válidos
      const validChannel = channel as NotificationChannel;
      let destination = '';
      
      // Determinar el destino según el canal
      if (validChannel === 'email') {
        destination = user.email || '';
      } else if (validChannel === 'whatsapp') {
        destination = user.phone || '';
      } else {
        destination = user.id || '';
      }
      
      if (!destination) {
        console.error(`No se pudo determinar el destino para el canal ${validChannel}`);
        return false;
      }
      
      // Enviar la notificación por el canal preferido
      return await this.sendNotification({
        canal: validChannel,
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
