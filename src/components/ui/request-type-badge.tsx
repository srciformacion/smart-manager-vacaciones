
import { cn } from "@/lib/utils";
import { RequestType } from "@/types";

interface RequestTypeBadgeProps {
  type: RequestType;
  className?: string;
}

export function RequestTypeBadge({ type, className }: RequestTypeBadgeProps) {
  const getTypeColor = (type: RequestType) => {
    switch (type) {
      case "vacation":
        return "bg-vacay text-vacay-foreground";
      case "personalDay":
        return "bg-info text-info-foreground";
      case "leave":
        return "bg-secondary text-secondary-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getTypeText = (type: RequestType) => {
    switch (type) {
      case "vacation":
        return "Vacaciones";
      case "personalDay":
        return "Asunto propio";
      case "leave":
        return "Permiso justificado";
      default:
        return type;
    }
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        getTypeColor(type),
        className
      )}
    >
      {getTypeText(type)}
    </span>
  );
}
