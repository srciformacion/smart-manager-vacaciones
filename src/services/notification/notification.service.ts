
import { NotificationPayload, NotificationType, NotificationChannel } from "@/types";
import { BaseNotificationService } from "./base-notification.service";
import { UserPreferenceService } from "./user-preference.service";

/**
 * Main class for handling notifications
 * Acts as a dispatcher to determine the appropriate channel for sending a notification
 */
export class NotificationService extends BaseNotificationService {
  /**
   * Sends a notification through the specified channel
   * @param notification Data for the notification to send
   */
  static async sendNotification(notification: NotificationPayload): Promise<boolean> {
    // Ensure we have both new and legacy format properties
    const normalizedNotification = this.normalizeNotificationPayload(notification);
    
    const channel = normalizedNotification.channel?.[0] || normalizedNotification.canal;
    console.log(`Sending notification via ${channel}:`, normalizedNotification);
    
    try {
      switch (channel) {
        case 'web':
          return await this.sendWebNotification(normalizedNotification);
        case 'email':
          return await this.sendEmailNotification(normalizedNotification);
        case 'whatsapp':
          return await this.sendWhatsAppNotification(normalizedNotification);
        default:
          console.error('Invalid notification channel:', channel);
          return false;
      }
    } catch (error) {
      console.error('Error sending notification:', error);
      return false;
    }
  }

  /**
   * Sends notifications to all authorized channels for a user
   */
  static async sendToAllAuthorizedChannels(userId: string, title: string, message: string, type?: NotificationType): Promise<boolean[]> {
    try {
      // Check consent
      const hasConsent = await UserPreferenceService.hasNotificationConsent(userId);
      if (!hasConsent) {
        console.warn('User has not given consent for notifications');
        return [false];
      }
      
      // Get user data
      const userJson = localStorage.getItem('user');
      if (!userJson) {
        console.error('User not found');
        return [false];
      }
      
      const user = JSON.parse(userJson);
      const channels = user.notification_channels || [user.preferredNotificationChannel || 'web'];
      
      // Send notifications for each channel
      const results = await Promise.all(channels.map(async (channel: string) => {
        let destination = '';
        
        // Determine destination based on channel
        if (channel === 'email') {
          destination = user.email || '';
        } else if (channel === 'whatsapp') {
          destination = user.phone || '';
        } else {
          destination = user.id || '';
        }
        
        if (!destination) {
          console.error(`Could not determine destination for channel ${channel}`);
          return false;
        }
        
        // Ensure channel is a valid type before assignment
        const validChannel = channel as NotificationChannel;
        
        // Send notification through the channel
        return await this.sendNotification({
          userId: user.id,
          title,
          message,
          type,
          channel: [validChannel],
          // For backwards compatibility
          canal: validChannel,
          destino: destination,
          titulo: title,
          mensaje: message,
          tipo: type
        });
      }));
      
      return results;
    } catch (error) {
      console.error('Error sending notifications:', error);
      return [false];
    }
  }

  /**
   * Sends a notification to a user's preferred channel
   */
  static async sendToPreferredChannel(userId: string, title: string, message: string, type?: NotificationType): Promise<boolean> {
    try {
      // Get user data
      const userJson = localStorage.getItem('user');
      if (!userJson) {
        console.error('User not found');
        return false;
      }
      
      const user = JSON.parse(userJson);
      const channel = user.preferredNotificationChannel || 'web';
      // Ensure channel is a valid type
      const validChannel = channel as NotificationChannel;
      let destination = '';
      
      // Determine destination based on channel
      if (validChannel === 'email') {
        destination = user.email || '';
      } else if (validChannel === 'whatsapp') {
        destination = user.phone || '';
      } else {
        destination = user.id || '';
      }
      
      if (!destination) {
        console.error(`Could not determine destination for channel ${validChannel}`);
        return false;
      }
      
      // Send notification through preferred channel
      return await this.sendNotification({
        userId: user.id,
        title,
        message,
        type,
        channel: [validChannel],
        // For backwards compatibility
        canal: validChannel,
        destino: destination,
        titulo: title,
        mensaje: message,
        tipo: type
      });
    } catch (error) {
      console.error('Error sending notification to preferred channel:', error);
      return false;
    }
  }

  /**
   * Normalizes notification payload to ensure both new and legacy properties are present
   * This helps maintain backward compatibility
   */
  private static normalizeNotificationPayload(notification: NotificationPayload): NotificationPayload {
    const normalizedNotification = { ...notification };
    
    // Ensure all properties exist in both formats
    if (notification.title && !notification.titulo) {
      normalizedNotification.titulo = notification.title;
    } else if (notification.titulo && !notification.title) {
      normalizedNotification.title = notification.titulo;
    }
    
    if (notification.message && !notification.mensaje) {
      normalizedNotification.mensaje = notification.message;
    } else if (notification.mensaje && !notification.message) {
      normalizedNotification.message = notification.mensaje;
    }
    
    if (notification.type && !notification.tipo) {
      normalizedNotification.tipo = notification.type;
    } else if (notification.tipo && !notification.type) {
      normalizedNotification.type = notification.tipo;
    }
    
    if (notification.channel && !notification.canal && notification.channel.length > 0) {
      normalizedNotification.canal = notification.channel[0];
    } else if (notification.canal && (!notification.channel || notification.channel.length === 0)) {
      normalizedNotification.channel = [notification.canal];
    }
    
    return normalizedNotification;
  }
}

// Global function to send notifications (can be used anywhere in the application)
export const sendNotification = (notification: NotificationPayload): Promise<boolean> => {
  return NotificationService.sendNotification(notification);
};
