
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface DatePickerFieldProps {
  label: string;
  value?: Date;
  onChange: (date: Date) => void;
  disabled?: boolean;
}

export const DatePickerField = ({
  label,
  value,
  onChange,
  disabled,
}: DatePickerFieldProps) => {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !value && "text-muted-foreground"
            )}
            disabled={disabled}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value ? (
              format(value, "PPP", { locale: es })
            ) : (
              <span>Selecciona una fecha</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={value}
            onSelect={(date) => onChange(date as Date)}
            disabled={disabled}
            initialFocus
            locale={es}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};
