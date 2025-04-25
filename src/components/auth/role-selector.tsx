import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/components/ui/use-toast";

interface RoleSelectorProps {
  onRoleSelect?: (role: string) => void;
}

export function RoleSelector({ onRoleSelect }: RoleSelectorProps) {
  const [selectedRole, setSelectedRole] = useState<string>("trabajador");
  const navigate = useNavigate();

  const handleSelect = () => {
    if (onRoleSelect) {
      onRoleSelect(selectedRole);
    }

    // Store role in localStorage
    localStorage.setItem("userRole", selectedRole);

    // Redirect based on role
    if (selectedRole === "rrhh") {
      navigate("/rrhh/dashboard");
    } else {
      navigate("/dashboard");
    }

    toast({
      title: "Rol seleccionado",
      description: `Has ingresado como ${selectedRole}.`,
    });
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Seleccione su rol</CardTitle>
        <CardDescription>
          Elija un rol para acceder al sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={selectedRole}
          onValueChange={setSelectedRole}
          className="space-y-4 my-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="trabajador" id="r1" />
            <Label htmlFor="r1" className="cursor-pointer">Trabajador</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="rrhh" id="r2" />
            <Label htmlFor="r2" className="cursor-pointer">Recursos Humanos</Label>
          </div>
        </RadioGroup>

        <Button onClick={handleSelect} className="w-full mt-4">
          Acceder
        </Button>
      </CardContent>
    </Card>
  );
}
