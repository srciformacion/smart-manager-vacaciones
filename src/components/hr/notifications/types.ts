
import { NotificationType, NotificationChannel } from "@/types";

export interface NotificationFormState {
  recipients: string;
  notificationType: NotificationType;
  channel: NotificationChannel;
  subject: string;
  message: string;
}

export interface RecipientsProps {
  selectedWorker: string;
  setSelectedWorker: (value: string) => void;
  recipients: string;
  onRecipientsChange: (value: string) => void;
}

export interface NotificationTypeSectionProps {
  value: NotificationType;
  onChange: (value: NotificationType) => void;
}

export interface NotificationChannelSectionProps {
  value: NotificationChannel;
  onChange: (value: NotificationChannel) => void;
}

export interface NotificationContentSectionProps {
  subject: string;
  message: string;
  onSubjectChange: (value: string) => void;
  onMessageChange: (value: string) => void;
}
