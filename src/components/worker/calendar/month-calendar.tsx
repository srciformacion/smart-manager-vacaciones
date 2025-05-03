
import { useState } from "react";
import { CalendarShift } from "@/types/calendar";
import { format, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, getDay } from "date-fns";
import { es } from "date-fns/locale";
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
  
  // Get the first day of the month and the last day of the month
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  
  // Get all days of the month
  const days = eachDayOfInterval({
    start: monthStart,
    end: monthEnd,
  });
  
  // Days of the week (0: Sunday, 1: Monday, ..., 6: Saturday)
  const weekDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  
  // Function to get the shift for a specific day
  const getShiftForDay = (day: Date) => {
    return shifts.find(shift => isSameDay(new Date(shift.date), day));
  };

  // Color by shift type
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
      case "guard":
        return "bg-purple-100 text-purple-800 border-purple-300";
      case "unassigned":
        return "bg-gray-100 text-gray-800 border-gray-300";
      case "training":
        return "bg-orange-100 text-orange-800 border-orange-300";
      case "special":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "oncall":
        return "bg-teal-100 text-teal-800 border-teal-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  // Translation of shift types
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
      case "guard":
        return "Guardia";
      case "unassigned":
        return "Sin asignar";
      case "training":
        return "Formación";
      case "special":
        return "Especial";
      case "oncall":
        return "Localizado";
      default:
        return type;
    }
  };

  return (
    <div className="bg-card rounded-md p-4 border">
      <div className="grid grid-cols-7 gap-1">
        {/* Header with days of the week */}
        {weekDays.map((day) => (
          <div 
            key={day} 
            className="text-center py-2 text-xs font-medium text-muted-foreground"
          >
            {day}
          </div>
        ))}
        
        {/* Empty spaces to adjust the first day of the month */}
        {Array.from({ length: (monthStart.getDay() + 6) % 7 }, (_, i) => (
          <div key={`empty-${i}`} className="aspect-square"></div>
        ))}
        
        {/* Days of the month */}
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
                  <p>{format(day, "EEEE d 'de' MMMM, yyyy", { locale: es })}</p>
                  {shift && shift.type !== "unassigned" && (
                    <>
                      <p className="font-bold">{getShiftTypeName(shift.type)}</p>
                      {shift.startTime && shift.endTime && (
                        <p>{shift.startTime} - {shift.endTime}</p>
                      )}
                      {shift.hours > 0 && <p>{shift.hours} horas</p>}
                      {shift.notes && <p className="italic">{shift.notes}</p>}
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
