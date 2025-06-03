
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, XCircle, AlertCircle } from "lucide-react";

interface StatusFilterSectionProps {
  selectedStatuses: string[];
  setSelectedStatuses: (statuses: string[]) => void;
}

export function StatusFilterSection({ selectedStatuses, setSelectedStatuses }: StatusFilterSectionProps) {
  const statusOptions = [
    { 
      value: "pending", 
      label: "Pendiente", 
      icon: <Clock className="h-3 w-3" />,
      color: "bg-yellow-100 text-yellow-800"
    },
    { 
      value: "approved", 
      label: "Aprobada", 
      icon: <CheckCircle className="h-3 w-3" />,
      color: "bg-green-100 text-green-800"
    },
    { 
      value: "rejected", 
      label: "Rechazada", 
      icon: <XCircle className="h-3 w-3" />,
      color: "bg-red-100 text-red-800"
    },
    { 
      value: "in_review", 
      label: "En revisión", 
      icon: <AlertCircle className="h-3 w-3" />,
      color: "bg-blue-100 text-blue-800"
    }
  ];

  const handleStatusChange = (status: string, checked: boolean) => {
    if (checked) {
      setSelectedStatuses([...selectedStatuses, status]);
    } else {
      setSelectedStatuses(selectedStatuses.filter(s => s !== status));
    }
  };

  return (
    <div className="space-y-3">
      <Label>Filtrar por estado de solicitud</Label>
      <div className="grid grid-cols-2 gap-3">
        {statusOptions.map((status) => (
          <div key={status.value} className="flex items-center space-x-2">
            <Checkbox
              id={status.value}
              checked={selectedStatuses.includes(status.value)}
              onCheckedChange={(checked) => 
                handleStatusChange(status.value, checked as boolean)
              }
            />
            <Label htmlFor={status.value} className="text-sm font-normal flex items-center gap-2">
              <Badge variant="secondary" className={`${status.color} flex items-center gap-1`}>
                {status.icon}
                {status.label}
              </Badge>
            </Label>
          </div>
        ))}
      </div>
      {selectedStatuses.length === 0 && (
        <p className="text-sm text-muted-foreground">
          Si no seleccionas ninguno, se incluirán todos los estados
        </p>
      )}
    </div>
  );
}
