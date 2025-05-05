
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";

interface HeaderProps {
  onDateChange: (date: Date | undefined) => void;
  onSearchChange: (term: string) => void;
  selectedDate: Date | undefined;
  searchTerm: string;
}

export function Header({ onDateChange, onSearchChange, selectedDate, searchTerm }: HeaderProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gestión de Solicitudes</h1>
        <p className="text-muted-foreground mt-2">
          Administre solicitudes y gestione permisos del personal
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-2">
        <DatePicker
          selectedDate={selectedDate}
          onSelect={onDateChange}
          placeholder="Filtrar por fecha"
        />
        <Input
          placeholder="Buscar solicitudes..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="max-w-[200px]"
        />
      </div>
    </div>
  );
}
