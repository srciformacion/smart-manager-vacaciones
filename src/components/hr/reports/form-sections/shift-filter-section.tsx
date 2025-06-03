
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Clock, Sun, Moon, Sunset } from "lucide-react";

interface ShiftFilterSectionProps {
  selectedShifts: string[];
  setSelectedShifts: (shifts: string[]) => void;
}

export function ShiftFilterSection({ selectedShifts, setSelectedShifts }: ShiftFilterSectionProps) {
  const shiftOptions = [
    { 
      value: "morning", 
      label: "Mañana (6:00-14:00)", 
      icon: <Sun className="h-3 w-3" />,
      color: "bg-yellow-100 text-yellow-800"
    },
    { 
      value: "afternoon", 
      label: "Tarde (14:00-22:00)", 
      icon: <Sunset className="h-3 w-3" />,
      color: "bg-orange-100 text-orange-800"
    },
    { 
      value: "night", 
      label: "Noche (22:00-6:00)", 
      icon: <Moon className="h-3 w-3" />,
      color: "bg-blue-100 text-blue-800"
    },
    { 
      value: "emergency", 
      label: "Urgencias 24h", 
      icon: <Clock className="h-3 w-3" />,
      color: "bg-red-100 text-red-800"
    },
    { 
      value: "oncall", 
      label: "Localizado", 
      icon: <Clock className="h-3 w-3" />,
      color: "bg-purple-100 text-purple-800"
    },
    { 
      value: "flexible", 
      label: "Horario flexible", 
      icon: <Clock className="h-3 w-3" />,
      color: "bg-green-100 text-green-800"
    }
  ];

  const handleShiftChange = (shift: string, checked: boolean) => {
    if (checked) {
      setSelectedShifts([...selectedShifts, shift]);
    } else {
      setSelectedShifts(selectedShifts.filter(s => s !== shift));
    }
  };

  return (
    <div className="space-y-3">
      <Label>Filtrar por turno/horario</Label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {shiftOptions.map((shift) => (
          <div key={shift.value} className="flex items-center space-x-2">
            <Checkbox
              id={shift.value}
              checked={selectedShifts.includes(shift.value)}
              onCheckedChange={(checked) => 
                handleShiftChange(shift.value, checked as boolean)
              }
            />
            <Label htmlFor={shift.value} className="text-sm font-normal flex items-center gap-2">
              <Badge variant="secondary" className={`${shift.color} flex items-center gap-1`}>
                {shift.icon}
                {shift.label}
              </Badge>
            </Label>
          </div>
        ))}
      </div>
      {selectedShifts.length === 0 && (
        <p className="text-sm text-muted-foreground">
          Si no seleccionas ninguno, se incluirán todos los turnos
        </p>
      )}
    </div>
  );
}
