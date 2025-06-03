
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface DepartmentSelectionProps {
  departments: string[];
  setDepartments: (departments: string[]) => void;
}

export function DepartmentSelection({ departments, setDepartments }: DepartmentSelectionProps) {
  const departmentOptions = [
    "Enfermería", "Medicina", "Administración", "Limpieza", 
    "Seguridad", "Cocina", "Mantenimiento", "Dirección"
  ];

  const handleDepartmentChange = (dept: string, checked: boolean) => {
    if (checked) {
      setDepartments([...departments, dept]);
    } else {
      setDepartments(departments.filter(d => d !== dept));
    }
  };

  return (
    <div className="space-y-3">
      <Label>Departamentos a incluir</Label>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {departmentOptions.map((dept) => (
          <div key={dept} className="flex items-center space-x-2">
            <Checkbox
              id={dept}
              checked={departments.includes(dept)}
              onCheckedChange={(checked) => 
                handleDepartmentChange(dept, checked as boolean)
              }
            />
            <Label htmlFor={dept} className="text-sm font-normal">
              {dept}
            </Label>
          </div>
        ))}
      </div>
      {departments.length === 0 && (
        <p className="text-sm text-muted-foreground">
          Si no seleccionas ninguno, se incluirán todos los departamentos
        </p>
      )}
    </div>
  );
}
