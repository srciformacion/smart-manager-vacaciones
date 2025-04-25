
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "./schema";

interface NotificationPreferencesProps {
  form: UseFormReturn<FormValues>;
  isSubmitting: boolean;
}

export function NotificationPreferences({ form, isSubmitting }: NotificationPreferencesProps) {
  const channels = [
    { id: "web", label: "Notificaciones web", description: "Recibirá notificaciones en la aplicación", requiresContact: false },
    { id: "email", label: "Email", description: "Recibirá notificaciones por correo electrónico", requiresContact: true, placeholder: "ejemplo@empresa.com" },
    { id: "whatsapp", label: "WhatsApp", description: "Recibirá notificaciones por WhatsApp", requiresContact: true, placeholder: "+34 XXX XXX XXX" }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Preferencias de notificación</h3>
        <p className="text-sm text-muted-foreground">
          Seleccione los canales por los que desea recibir notificaciones
        </p>
      </div>

      <div className="space-y-4">
        {channels.map((channel, index) => (
          <FormField
            key={channel.id}
            control={form.control}
            name={`notificationChannels.${index}`}
            render={({ field }) => (
              <FormItem className="flex flex-col space-y-4">
                <div className="flex items-center justify-between space-x-2">
                  <div>
                    <FormLabel>{channel.label}</FormLabel>
                    <FormDescription>{channel.description}</FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value?.enabled}
                      onCheckedChange={(checked) => {
                        const currentValue = form.getValues(`notificationChannels.${index}`);
                        form.setValue(`notificationChannels.${index}`, {
                          channel: channel.id as "web" | "email" | "whatsapp",
                          enabled: checked,
                          contactValue: currentValue?.contactValue || ""
                        });
                      }}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                </div>
                {channel.requiresContact && field.value?.enabled && (
                  <FormField
                    control={form.control}
                    name={`notificationChannels.${index}.contactValue`}
                    render={({ field: contactField }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            {...contactField}
                            placeholder={channel.placeholder}
                            disabled={isSubmitting}
                            className="max-w-sm"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </FormItem>
            )}
          />
        ))}
      </div>

      <FormField
        control={form.control}
        name="consentNotifications"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 pt-4">
            <FormControl>
              <Checkbox 
                checked={field.value}
                onCheckedChange={field.onChange}
                disabled={isSubmitting}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>
                Acepto recibir notificaciones por los canales seleccionados
              </FormLabel>
              <FormDescription>
                Las notificaciones incluyen cambios en turnos, aprobaciones de solicitudes y otros avisos importantes. Puede modificar estas preferencias en cualquier momento.
              </FormDescription>
              <FormMessage />
            </div>
          </FormItem>
        )}
      />
    </div>
  );
}
