
import { RequestType } from "@/types";
import { Badge } from "@/components/ui/badge";

interface RequestTypeBadgeProps {
  type: RequestType;
}

export function RequestTypeBadge({ type }: RequestTypeBadgeProps) {
  switch (type) {
    case "vacation":
      return (
        <Badge className="bg-blue-100 hover:bg-blue-200 text-blue-800 border-blue-300">
          Vacaciones
        </Badge>
      );
    case "personalDay":
      return (
        <Badge className="bg-green-100 hover:bg-green-200 text-green-800 border-green-300">
          Asuntos propios
        </Badge>
      );
    case "leave":
      return (
        <Badge className="bg-purple-100 hover:bg-purple-200 text-purple-800 border-purple-300">
          Permiso justificado
        </Badge>
      );
    case "shiftChange":
      return (
        <Badge className="bg-amber-100 hover:bg-amber-200 text-amber-800 border-amber-300">
          Cambio de turno
        </Badge>
      );
    default:
      return (
        <Badge variant="outline">
          {type}
        </Badge>
      );
  }
}
