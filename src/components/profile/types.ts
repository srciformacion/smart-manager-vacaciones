
import React from "react";

export interface Profile {
  id?: string;
  name: string;
  surname: string;
  dni: string;
  email: string;
  department: string;
  profilePhoto?: string;
  start_date?: Date;
  preferred_notification_channel?: string;
  notification_channels?: string[];
  notification_consent?: boolean;
}

export interface ProfileFormProps {
  form: Profile;
  edit: boolean;
  saving: boolean;
  createMode: boolean;
  onSave: () => void;
  onCancel: () => void;
  onEdit: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement> | Date | { target: { name: string; value: any } }) => void;
  onPhotoChange?: (photoUrl: string) => void;
}
