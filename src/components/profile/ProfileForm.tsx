
import React from "react";
import { ProfileFormProps } from "./types";
import { FormField } from "./FormField";
import { FormActions } from "./FormActions";
import { DatePickerField } from "./DatePickerField";
import { ProfilePhotoUpload } from "./ProfilePhotoUpload";
import { NotificationPreferences } from "./NotificationPreferences";
import { Separator } from "@/components/ui/separator";

export const ProfileForm = ({
  form,
  edit,
  saving,
  createMode,
  onSave,
  onCancel,
  onEdit,
  onChange,
  onPhotoChange,
}: ProfileFormProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e);
  };

  const handleDateChange = (date: Date) => {
    onChange(date);
  };

  const handleNotificationChannelChange = (channels: string[]) => {
    // Usar un enfoque diferente para la creación del evento simulado
    // En lugar de intentar simular un evento React completo, proporcionamos
    // un objeto parcial con la misma estructura que necesita la función onChange
    onChange({
      target: {
        name: "notification_channels",
        value: channels,
      }
    } as unknown as React.ChangeEvent<HTMLInputElement>);
  };

  const handleNotificationConsent = (value: boolean) => {
    // Usar el mismo enfoque que con los canales de notificación
    onChange({
      target: {
        name: "notification_consent",
        value,
      }
    } as unknown as React.ChangeEvent<HTMLInputElement>);
  };

  return (
    <div className="space-y-6">
      {onPhotoChange && (
        <div className="flex justify-center mb-6">
          <ProfilePhotoUpload 
            photoUrl={form.profilePhoto} 
            onPhotoChange={onPhotoChange}
            disabled={!edit && !createMode}
          />
        </div>
      )}

      <div className="space-y-4">
        <FormField
          label="Nombre"
          name="name"
          value={form.name}
          onChange={handleChange}
          disabled={!edit && !createMode}
          required
        />
        <FormField
          label="Apellidos"
          name="surname"
          value={form.surname}
          onChange={handleChange}
          disabled={!edit && !createMode}
          required
        />
        <FormField
          label="DNI"
          name="dni"
          value={form.dni}
          onChange={handleChange}
          disabled={!edit && !createMode}
          required
        />
        <FormField
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          disabled={!edit && !createMode}
          required
        />
        <FormField
          label="Departamento"
          name="department"
          value={form.department}
          onChange={handleChange}
          disabled={!edit && !createMode}
          required
        />
        <DatePickerField
          label="Fecha de incorporación"
          value={form.start_date}
          onChange={handleDateChange}
          disabled={!edit && !createMode}
        />
        
        <Separator className="my-6" />
        
        <NotificationPreferences
          selectedChannels={form.notification_channels || []}
          hasConsent={form.notification_consent || false}
          onChannelChange={handleNotificationChannelChange}
          onConsentChange={handleNotificationConsent}
          disabled={!edit && !createMode}
        />
      </div>

      <FormActions
        edit={edit}
        saving={saving}
        createMode={createMode}
        onSave={onSave}
        onCancel={onCancel}
        onEdit={onEdit}
      />
    </div>
  );
};
