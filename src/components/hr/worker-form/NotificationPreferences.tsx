
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "./schema";

interface NotificationPreferencesProps {
  form: UseFormReturn<FormValues>;
  isSubmitting: boolean;
}

export function NotificationPreferences({ form, isSubmitting }: NotificationPreferencesProps) {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="preferredNotificationChannel"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Canal de notificación preferido</FormLabel>
            <Select
              disabled={isSubmitting}
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione un canal" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="web">Notificaciones web</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="whatsapp">WhatsApp</SelectItem>
              </SelectContent>
            </Select>
            <FormDescription>
              Recibirá notificaciones importantes a través del canal seleccionado
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="consentNotifications"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox 
                checked={field.value}
                onCheckedChange={field.onChange}
                disabled={isSubmitting}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>
                Acepto recibir notificaciones importantes relacionadas con mi trabajo
              </FormLabel>
              <FormDescription>
                Las notificaciones incluyen cambios en turnos, aprobaciones de solicitudes y otros avisos importantes
              </FormDescription>
              <FormMessage />
            </div>
          </FormItem>
        )}
      />
    </div>
  );
}

