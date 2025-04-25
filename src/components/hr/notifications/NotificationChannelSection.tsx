
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Mail, MessageSquare, Bell } from "lucide-react";
import { NotificationChannelSectionProps } from "./types";

export function NotificationChannelSection({ value, onChange }: NotificationChannelSectionProps) {
  return (
    <div className="space-y-2">
      <Label>Canal de envío</Label>
      <RadioGroup 
        value={value} 
        onValueChange={onChange}
        className="flex gap-8"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="web" id="web" />
          <Label htmlFor="web" className="flex items-center gap-1">
            Web <Bell className="h-4 w-4" />
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="email" id="email" />
          <Label htmlFor="email" className="flex items-center gap-1">
            Email <Mail className="h-4 w-4" />
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="whatsapp" id="whatsapp" />
          <Label htmlFor="whatsapp" className="flex items-center gap-1">
            WhatsApp <MessageSquare className="h-4 w-4" />
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
}
