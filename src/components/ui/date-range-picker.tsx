
import * as React from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { WorkGroup } from "@/types";
import { validateDatesForWorkGroup } from "@/utils/vacationLogic";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DateRangePickerProps {
  value: DateRange | undefined;
  onChange: (date: DateRange | undefined) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  workGroup?: WorkGroup;
}

export function DateRangePicker({
  value,
  onChange,
  disabled,
  placeholder = "Seleccionar fechas",
  className,
  workGroup,
}: DateRangePickerProps) {
  const handleSelect = (dateRange: DateRange | undefined) => {
    if (!dateRange?.from || !dateRange?.to || !workGroup) {
      onChange(dateRange);
      return;
    }

    // Validate the date range according to work group rules
    const validation = validateDatesForWorkGroup(dateRange.from, dateRange.to, workGroup);
    
    if (validation.valid) {
      onChange(dateRange);
    } else {
      console.warn("Fecha inválida:", validation.message);
    }
  };

  const modifiers = React.useMemo(() => {
    if (!workGroup) return {};

    switch (workGroup) {
      case 'Grupo Localizado':
      case 'Urgente 12h':
      case 'Grupo 1/3':
        return {
          // Solo permitir seleccionar desde el 1 o el 16 de cada mes
          startDate: (date: Date) => {
            const day = date.getDate();
            return day === 1 || day === 16;
          },
        };
      case 'Grupo Programado':
      case 'Top Programado':
        return {
          // Solo permitir seleccionar desde el lunes
          startDate: (date: Date) => {
            return date.getDay() === 1; // 1 es lunes
          },
        };
      default:
        return {};
    }
  }, [workGroup]);

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !value && "text-muted-foreground"
            )}
            disabled={disabled}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value?.from ? (
              value.to ? (
                <>
                  {format(value.from, "PPP", { locale: es })} -{" "}
                  {format(value.to, "PPP", { locale: es })}
                </>
              ) : (
                format(value.from, "PPP", { locale: es })
              )
            ) : (
              <span>{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-popover" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={value?.from}
            selected={value}
            onSelect={handleSelect}
            numberOfMonths={1}
            locale={es}
            modifiers={modifiers}
            className={cn("p-3 pointer-events-auto bg-popover border-0")}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
