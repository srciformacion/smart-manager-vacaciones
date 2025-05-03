
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, FileDown, ChevronLeft, ChevronRight } from "lucide-react";
import { format, addDays, subDays, addMonths, subMonths, addYears, subYears } from "date-fns";
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
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface WorkCalendarHeaderProps {
  currentDate: Date;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onDateSelect: (date: Date) => void;
  onExport: (format: 'pdf' | 'excel' | 'csv') => void;
  onNavigate: (type: 'day' | 'month' | 'year', direction: 'previous' | 'next') => void;
}

export function WorkCalendarHeader({
  currentDate,
  onPreviousMonth,
  onNextMonth,
  onDateSelect,
  onExport,
  onNavigate
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
          {/* Navegación rápida */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-r-none"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={() => onNavigate('day', 'previous')}>
                Día anterior
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onPreviousMonth}>
                Mes anterior
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onNavigate('year', 'previous')}>
                Año anterior
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
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
            <PopoverContent className="w-auto p-0" align="start">
              <div className="p-2">
                <Select 
                  value={currentDate.getFullYear().toString()} 
                  onValueChange={(year) => {
                    const newDate = new Date(currentDate);
                    newDate.setFullYear(parseInt(year));
                    onDateSelect(newDate);
                  }}
                >
                  <SelectTrigger className="w-full mb-2">
                    <SelectValue placeholder="Seleccione año" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 10 }, (_, i) => (
                      <SelectItem key={i} value={(new Date().getFullYear() - 5 + i).toString()}>
                        {new Date().getFullYear() - 5 + i}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Calendar
                  mode="single"
                  selected={currentDate}
                  onSelect={(date) => date && onDateSelect(date)}
                  initialFocus
                  className="pointer-events-auto"
                />
              </div>
            </PopoverContent>
          </Popover>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-l-none"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onNavigate('day', 'next')}>
                Día siguiente
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onNextMonth}>
                Mes siguiente
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onNavigate('year', 'next')}>
                Año siguiente
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
