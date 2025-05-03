
import React, { useState } from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Mail, MessageSquare, Bell } from "lucide-react";

interface NotificationPreferencesProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export const NotificationPreferences: React.FC<NotificationPreferencesProps> = ({ 
  value, 
  onChange, 
  disabled = false 
}) => {
  const [selectedChannels, setSelectedChannels] = useState<string[]>(value ? [value] : []);
  const [hasConsent, setHasConsent] = useState(false);

  const handleChannelChange = (channelValue: string) => {
    let newSelectedChannels: string[];
    
    if (selectedChannels.includes(channelValue)) {
      // Remove channel if already selected
      newSelectedChannels = selectedChannels.filter(channel => channel !== channelValue);
    } else {
      // Add channel if not already selected
      newSelectedChannels = [...selectedChannels, channelValue];
    }
    
    setSelectedChannels(newSelectedChannels);
    
    // Set the primary channel (first in the array) as the preferred one
    if (newSelectedChannels.length > 0) {
      onChange(newSelectedChannels[0]);
    } else {
      onChange('web'); // Default to web if nothing selected
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base">Canales de notificación</Label>
      </div>
      
      <div className="space-y-2">
        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4">
          <div className="flex items-center space-x-2 rounded-md border p-2">
            <Checkbox 
              id="web" 
              checked={selectedChannels.includes('web')}
              onCheckedChange={() => handleChannelChange('web')}
              disabled={disabled}
            />
            <Label htmlFor="web" className="flex items-center gap-1 cursor-pointer">
              Web <Bell className="h-4 w-4 text-purple-600" />
            </Label>
          </div>
          
          <div className="flex items-center space-x-2 rounded-md border p-2">
            <Checkbox 
              id="email" 
              checked={selectedChannels.includes('email')}
              onCheckedChange={() => handleChannelChange('email')}
              disabled={disabled}
            />
            <Label htmlFor="email" className="flex items-center gap-1 cursor-pointer">
              Email <Mail className="h-4 w-4 text-blue-600" />
            </Label>
          </div>
          
          <div className="flex items-center space-x-2 rounded-md border p-2">
            <Checkbox 
              id="whatsapp" 
              checked={selectedChannels.includes('whatsapp')}
              onCheckedChange={() => handleChannelChange('whatsapp')}
              disabled={disabled}
            />
            <Label htmlFor="whatsapp" className="flex items-center gap-1 cursor-pointer">
              WhatsApp <MessageSquare className="h-4 w-4 text-green-600" />
            </Label>
          </div>
        </div>
        
        <div className="mt-4 flex items-start space-x-2">
          <Checkbox 
            id="consent" 
            checked={hasConsent}
            onCheckedChange={(checked) => setHasConsent(checked === true)}
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
