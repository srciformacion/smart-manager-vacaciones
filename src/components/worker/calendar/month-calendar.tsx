
import { useState } from "react";
import { CalendarShift } from "@/types/calendar";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from "date-fns";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface MonthCalendarProps {
  currentDate: Date;
  shifts: CalendarShift[];
}

export function MonthCalendar({ currentDate, shifts }: MonthCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  // Obtener el primer día del mes, el último día del mes
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  
  // Obtener todos los días del mes
  const days = eachDayOfInterval({
    start: monthStart,
    end: monthEnd,
  });
  
  // Obtener todos los días de la semana (0: domingo, 1: lunes, ..., 6: sábado)
  const weekDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  
  // Función para obtener el turno de un día específico
  const getShiftForDay = (day: Date) => {
    return shifts.find(shift => isSameDay(new Date(shift.date), day));
  };

  // Color por tipo de turno
  const getShiftColor = (type: string) => {
    switch (type) {
      case "morning":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "afternoon":
        return "bg-amber-100 text-amber-800 border-amber-300";
      case "night":
        return "bg-indigo-100 text-indigo-800 border-indigo-300";
      case "24h":
        return "bg-red-100 text-red-800 border-red-300";
      case "free":
        return "bg-green-100 text-green-800 border-green-300";
      case "unassigned":
        return "bg-gray-100 text-gray-800 border-gray-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  // Traducción de tipos de turno
  const getShiftTypeName = (type: string) => {
    switch (type) {
      case "morning":
        return "Mañana";
      case "afternoon":
        return "Tarde";
      case "night":
        return "Noche";
      case "24h":
        return "Guardia 24h";
      case "free":
        return "Libre";
      case "unassigned":
        return "Sin asignar";
      default:
        return type;
    }
  };

  return (
    <div className="bg-card rounded-md p-4 border">
      <div className="grid grid-cols-7 gap-1">
        {/* Cabecera con los días de la semana */}
        {weekDays.map((day) => (
          <div 
            key={day} 
            className="text-center py-2 text-xs font-medium text-muted-foreground"
          >
            {day}
          </div>
        ))}
        
        {/* Espacios vacíos para ajustar el primer día del mes */}
        {Array.from({ length: (monthStart.getDay() + 6) % 7 }, (_, i) => (
          <div key={`empty-${i}`} className="aspect-square"></div>
        ))}
        
        {/* Días del mes */}
        {days.map((day) => {
          const shift = getShiftForDay(day);
          const isToday = isSameDay(day, new Date());
          const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;
          
          return (
            <TooltipProvider key={day.toISOString()}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div 
                    className={cn(
                      "aspect-square p-1 border rounded-md cursor-pointer transition-all",
                      isToday && "ring-2 ring-primary",
                      isSelected && "ring-2 ring-primary-foreground",
                      !shift || shift.type === "unassigned" ? "hover:bg-muted/50" : "hover:bg-opacity-80"
                    )}
                    onClick={() => setSelectedDate(day)}
                  >
                    <div className="h-full flex flex-col">
                      <div className="text-right text-xs p-1">
                        {format(day, "d")}
                      </div>
                      
                      {shift && shift.type !== "unassigned" && (
                        <div className="flex-1 flex items-end justify-center pb-1">
                          <Badge 
                            className={cn(
                              "text-[0.6rem] h-5 px-1",
                              getShiftColor(shift.type)
                            )}
                            variant="outline"
                          >
                            {getShiftTypeName(shift.type)}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{format(day, "EEEE d 'de' MMMM, yyyy")}</p>
                  {shift && shift.type !== "unassigned" && (
                    <>
                      <p className="font-bold">{getShiftTypeName(shift.type)}</p>
                      {shift.startTime && shift.endTime && (
                        <p>{shift.startTime} - {shift.endTime}</p>
                      )}
                      {shift.hours > 0 && <p>{shift.hours} horas</p>}
                    </>
                  )}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        })}
      </div>
    </div>
  );
}
