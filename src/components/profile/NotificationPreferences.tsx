
import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Mail, MessageSquare, Bell } from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface NotificationPreferencesProps {
  selectedChannels: string[];
  hasConsent: boolean;
  onChannelChange: (channels: string[]) => void;
  onConsentChange: (value: boolean) => void;
  disabled?: boolean;
}

export const NotificationPreferences: React.FC<NotificationPreferencesProps> = ({
  selectedChannels,
  hasConsent,
  onChannelChange, 
  onConsentChange,
  disabled = false 
}) => {
  const handleChannelChange = (channelValue: string, isChecked: boolean) => {
    let newSelectedChannels: string[];
    
    if (isChecked) {
      // Add channel if not already selected
      newSelectedChannels = [...selectedChannels, channelValue];
    } else {
      // Remove channel if already selected
      newSelectedChannels = selectedChannels.filter(channel => channel !== channelValue);
    }
    
    onChannelChange(newSelectedChannels);
  };

  return (
    <div className="space-y-5 rounded-lg border p-5">
      <div className="flex items-center justify-between">
        <Label className="text-base font-medium">Canales de notificación</Label>
      </div>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="flex items-center space-x-2 rounded-md border p-3 transition-colors hover:bg-muted/50">
            <Checkbox 
              id="web" 
              checked={selectedChannels.includes('web')}
              onCheckedChange={(checked) => handleChannelChange('web', checked === true)}
              disabled={disabled}
              className="h-5 w-5"
            />
            <div className="flex-1">
              <Label htmlFor="web" className="flex items-center gap-2 cursor-pointer">
                <Bell className="h-5 w-5 text-purple-600" />
                <span className="font-medium">Web</span>
              </Label>
              <p className="text-xs text-muted-foreground mt-1">
                Notificaciones dentro de la aplicación
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 rounded-md border p-3 transition-colors hover:bg-muted/50">
            <Checkbox 
              id="email" 
              checked={selectedChannels.includes('email')}
              onCheckedChange={(checked) => handleChannelChange('email', checked === true)}
              disabled={disabled}
              className="h-5 w-5"
            />
            <div className="flex-1">
              <Label htmlFor="email" className="flex items-center gap-2 cursor-pointer">
                <Mail className="h-5 w-5 text-blue-600" />
                <span className="font-medium">Email</span>
              </Label>
              <p className="text-xs text-muted-foreground mt-1">
                Notificaciones por correo electrónico
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 rounded-md border p-3 transition-colors hover:bg-muted/50">
            <Checkbox 
              id="whatsapp" 
              checked={selectedChannels.includes('whatsapp')}
              onCheckedChange={(checked) => handleChannelChange('whatsapp', checked === true)}
              disabled={disabled}
              className="h-5 w-5"
            />
            <div className="flex-1">
              <Label htmlFor="whatsapp" className="flex items-center gap-2 cursor-pointer">
                <MessageSquare className="h-5 w-5 text-green-600" />
                <span className="font-medium">WhatsApp</span>
              </Label>
              <p className="text-xs text-muted-foreground mt-1">
                Mensajes directos por WhatsApp
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-4 flex items-start space-x-4 rounded-md border p-4">
          <Switch
            id="consent"
            checked={hasConsent}
            onCheckedChange={onConsentChange}
            disabled={disabled || selectedChannels.length === 0}
          />
          <div>
            <Label htmlFor="consent" className="text-sm font-medium cursor-pointer">
              Autorizo el uso de los canales seleccionados como medio de notificaciones de la empresa
            </Label>
            <p className="mt-1 text-xs text-muted-foreground">
              Las notificaciones pueden incluir cambios en turnos, aprobación de solicitudes y otros avisos importantes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
