
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, FileDown } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Calendar } from "@/components/ui/calendar";

interface WorkCalendarHeaderProps {
  currentDate: Date;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onDateSelect: (date: Date) => void;
  onExport: (format: 'pdf' | 'excel' | 'csv') => void;
}

export function WorkCalendarHeader({
  currentDate,
  onPreviousMonth,
  onNextMonth,
  onDateSelect,
  onExport
}: WorkCalendarHeaderProps) {
  // Formatear el mes y año actual
  const formattedMonth = format(currentDate, "MMMM yyyy", { locale: es });
  
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
      <div>
        <h2 className="text-2xl font-bold leading-none tracking-tight">Calendario Laboral</h2>
        <p className="text-muted-foreground">
          Visualiza y gestiona tu calendario laboral, turnos y horas
        </p>
      </div>
      
      <div className="flex items-center gap-2 self-end sm:self-auto">
        <div className="flex items-center rounded-md border">
          <Button
            variant="ghost"
            size="icon"
            onClick={onPreviousMonth}
            className="rounded-r-none"
          >
            ←
          </Button>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="ghost" 
                className="flex items-center gap-1 min-w-36 justify-center rounded-none"
              >
                <CalendarIcon className="h-4 w-4" />
                <span className="capitalize">{formattedMonth}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={currentDate}
                onSelect={(date) => date && onDateSelect(date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={onNextMonth}
            className="rounded-l-none"
          >
            →
          </Button>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-1">
              <FileDown className="h-4 w-4" />
              <span>Exportar</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onExport('pdf')}>
              PDF
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onExport('excel')}>
              Excel
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onExport('csv')}>
              CSV
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
