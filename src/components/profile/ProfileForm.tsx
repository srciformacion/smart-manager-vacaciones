
import { ProfileFormProps } from "./types";
import { FormField } from "./FormField";
import { FormActions } from "./FormActions";
import { DatePickerField } from "./DatePickerField";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export const ProfileForm = ({
  form,
  edit,
  saving,
  createMode,
  onSave,
  onCancel,
  onEdit,
  onChange,
}: ProfileFormProps) => {
  return (
    <div className="space-y-6">
      <FormField
        name="name"
        label="Nombre"
        value={form.name || ""}
        disabled={!edit}
        onChange={onChange}
        required
      />

      <FormField
        name="surname"
        label="Apellido"
        value={form.surname || ""}
        disabled={!edit}
        onChange={onChange}
        required
      />

      <FormField
        name="email"
        label="Email"
        type="email"
        value={form.email || ""}
        disabled={!edit || !createMode}
        onChange={onChange}
        required
      />

      <FormField
        name="dni"
        label="DNI/NIE"
        value={form.dni || ""}
        disabled={!edit}
        onChange={onChange}
      />

      <FormField
        name="department"
        label="Departamento"
        value={form.department || ""}
        disabled={!edit}
        onChange={onChange}
      />

      <DatePickerField
        label="Fecha de inicio"
        value={form.start_date}
        disabled={!edit}
        onChange={(date) => onChange(date as Date)}
      />

      <div className="space-y-2">
        <Label>Canal de notificación preferido</Label>
        <Select
          name="preferred_notification_channel"
          value={form.preferred_notification_channel || "web"}
          onValueChange={(value) => onChange({ target: { name: 'preferred_notification_channel', value } } as any)}
          disabled={!edit}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Seleccionar canal" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="web">Notificaciones web</SelectItem>
            <SelectItem value="email">Email</SelectItem>
            <SelectItem value="whatsapp">WhatsApp</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-sm text-muted-foreground mt-1">
          {!edit ? form.preferred_notification_channel === 'web' 
            ? 'Recibirás notificaciones en la aplicación web' 
            : form.preferred_notification_channel === 'email'
            ? `Recibirás notificaciones por email en ${form.email}`
            : `Recibirás notificaciones por WhatsApp`
            : 'Selecciona tu canal preferido para recibir notificaciones importantes'}
        </p>
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
