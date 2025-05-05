
import { NotificationPayload } from "@/types";
import { toast } from "@/hooks/use-toast";

/**
 * Base class to handle notification operations
 */
export class BaseNotificationService {
  /**
   * Sends a web notification by storing it in localStorage and displaying a toast
   */
  protected static async sendWebNotification(notification: NotificationPayload): Promise<boolean> {
    try {
      // In a real environment, this would be an API call to store in the database
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
      
      // Show a toast for real-time notifications (simulated)
      toast({
        title: newNotification.title,
        description: newNotification.message,
      });
      
      // Dispatch an event for components to update
      window.dispatchEvent(new Event('notification'));
      
      return true;
    } catch (error) {
      console.error('Error sending web notification:', error);
      return false;
    }
  }

  /**
   * Simulates sending an email notification
   */
  protected static async sendEmailNotification(notification: NotificationPayload): Promise<boolean> {
    try {
      // MOCK: In a real environment, this would be a call to an email service like SendGrid
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
      console.error('Error sending email:', error);
      return false;
    }
  }

  /**
   * Simulates sending a WhatsApp notification
   */
  protected static async sendWhatsAppNotification(notification: NotificationPayload): Promise<boolean> {
    try {
      // MOCK: In a real environment, this would be a call to Twilio or WhatsApp Business API
      const destination = notification.destino || 'user-phone';
      console.log(`MOCK WHATSAPP SENT TO: ${destination}`);
      console.log(`Message: ${notification.title || notification.titulo || ''}: ${notification.message || notification.mensaje || ''}`);
      
      toast({
        title: "WhatsApp enviado (simulado)",
        description: `A: ${destination}`,
      });
      
      return true;
    } catch (error) {
      console.error('Error sending WhatsApp:', error);
      return false;
    }
  }
}
