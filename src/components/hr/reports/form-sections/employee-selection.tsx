
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Users } from "lucide-react";

interface EmployeeSelectionProps {
  selectedEmployees: string[];
  setSelectedEmployees: (employees: string[]) => void;
  allEmployees?: boolean;
  setAllEmployees: (all: boolean) => void;
}

export function EmployeeSelection({ 
  selectedEmployees, 
  setSelectedEmployees, 
  allEmployees = true,
  setAllEmployees 
}: EmployeeSelectionProps) {
  const employees = [
    { id: "1", name: "María García", department: "Enfermería" },
    { id: "2", name: "Juan Pérez", department: "Medicina" },
    { id: "3", name: "Ana López", department: "Administración" },
    { id: "4", name: "Carlos Ruiz", department: "Seguridad" },
    { id: "5", name: "Laura Martín", department: "Limpieza" },
    { id: "6", name: "Pedro Sánchez", department: "Mantenimiento" },
    { id: "7", name: "Carmen Rodríguez", department: "Cocina" },
    { id: "8", name: "Miguel Torres", department: "Dirección" }
  ];

  const handleEmployeeChange = (employeeId: string, checked: boolean) => {
    if (checked) {
      setSelectedEmployees([...selectedEmployees, employeeId]);
    } else {
      setSelectedEmployees(selectedEmployees.filter(id => id !== employeeId));
    }
  };

  const handleAllEmployeesChange = (checked: boolean | "indeterminate") => {
    setAllEmployees(checked === true);
    if (checked) {
      setSelectedEmployees([]);
    }
  };

  return (
    <div className="space-y-3">
      <Label className="flex items-center gap-2">
        <Users className="h-4 w-4" />
        Selección de empleados
      </Label>
      
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="all-employees"
            checked={allEmployees}
            onCheckedChange={handleAllEmployeesChange}
          />
          <Label htmlFor="all-employees" className="text-sm font-normal">
            Incluir todos los empleados
          </Label>
        </div>
        
        {!allEmployees && (
          <div className="ml-6 space-y-2 max-h-40 overflow-y-auto border rounded-md p-3">
            {employees.map((employee) => (
              <div key={employee.id} className="flex items-center space-x-2">
                <Checkbox
                  id={employee.id}
                  checked={selectedEmployees.includes(employee.id)}
                  onCheckedChange={(checked) => 
                    handleEmployeeChange(employee.id, checked as boolean)
                  }
                />
                <Label htmlFor={employee.id} className="text-sm font-normal flex-1">
                  {employee.name}
                  <span className="text-muted-foreground ml-2">({employee.department})</span>
                </Label>
              </div>
            ))}
          </div>
        )}
        
        {!allEmployees && selectedEmployees.length === 0 && (
          <p className="text-sm text-muted-foreground ml-6">
            Selecciona al menos un empleado
          </p>
        )}
      </div>
    </div>
  );
}
