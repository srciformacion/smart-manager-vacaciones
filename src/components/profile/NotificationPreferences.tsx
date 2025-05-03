
import React from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base">Canal preferido de notificación</Label>
      </div>
      <RadioGroup 
        value={value || 'web'} 
        onValueChange={onChange}
        className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4"
        disabled={disabled}
      >
        <div className="flex items-center space-x-2 rounded-md border p-2">
          <RadioGroupItem value="web" id="web" />
          <Label htmlFor="web" className="flex items-center gap-1 cursor-pointer">
            Web <Bell className="h-4 w-4 text-purple-600" />
          </Label>
        </div>
        <div className="flex items-center space-x-2 rounded-md border p-2">
          <RadioGroupItem value="email" id="email" />
          <Label htmlFor="email" className="flex items-center gap-1 cursor-pointer">
            Email <Mail className="h-4 w-4 text-blue-600" />
          </Label>
        </div>
        <div className="flex items-center space-x-2 rounded-md border p-2">
          <RadioGroupItem value="whatsapp" id="whatsapp" />
          <Label htmlFor="whatsapp" className="flex items-center gap-1 cursor-pointer">
            WhatsApp <MessageSquare className="h-4 w-4 text-green-600" />
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
};
