
import { NotificationChannel } from "@/types";

/**
 * Service for managing user notification preferences
 */
export class UserPreferenceService {
  /**
   * Gets the notification channels a user has configured
   */
  static async getNotificationChannels(userId: string): Promise<string[]> {
    // In a real environment, this would be a database query
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      return user.notification_channels || [user.preferredNotificationChannel || 'web'];
    } catch (error) {
      console.error('Error getting notification channels:', error);
      return ['web']; // Default
    }
  }

  /**
   * Checks if a user has given consent for notifications
   */
  static async hasNotificationConsent(userId: string): Promise<boolean> {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      return user.notification_consent === true;
    } catch (error) {
      console.error('Error checking consent:', error);
      return false;
    }
  }

  /**
   * Gets a user's preferred notification channel
   */
  static async getPreferredChannel(userId: string): Promise<NotificationChannel> {
    // In a real environment, this would be a database query
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const preferredChannel = user.preferredNotificationChannel || 'web';
      // Ensure the returned value is of type NotificationChannel
      if (preferredChannel !== 'web' && preferredChannel !== 'email' && preferredChannel !== 'whatsapp') {
        return 'web'; // Return a default value if not a valid type
      }
      return preferredChannel as NotificationChannel;
    } catch (error) {
      console.error('Error getting preferred notification channel:', error);
      return 'web'; // Default
    }
  }
}
