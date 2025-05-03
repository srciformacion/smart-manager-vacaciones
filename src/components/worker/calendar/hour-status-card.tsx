
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface HourStatusCardProps {
  title: string;
  currentValue: number;
  maxValue: number;
  status: "positive" | "negative" | "warning" | "neutral";
  percentage: number;
  icon?: React.ReactNode;
  extraInfo?: string;
}

export function HourStatusCard({
  title,
  currentValue,
  maxValue,
  status,
  percentage,
  icon,
  extraInfo
}: HourStatusCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "positive":
        return "text-emerald-500";
      case "negative":
        return "text-red-500";
      case "warning":
        return "text-amber-500";
      default:
        return "text-gray-500";
    }
  };

  const getProgressColor = (status: string) => {
    switch (status) {
      case "positive":
        return "bg-emerald-500";
      case "negative":
        return "bg-red-500";
      case "warning":
        return "bg-amber-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">
          {icon && <span className="mr-2">{icon}</span>}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          <span className={cn(getStatusColor(status))}>
            {currentValue.toLocaleString()}
          </span>
          <span className="text-muted-foreground text-sm font-normal ml-1">
            / {maxValue.toLocaleString()}
          </span>
        </div>
        
        <Progress 
          value={percentage} 
          className="h-2 mt-2"
          indicatorClassName={cn(getProgressColor(status))}
        />
        
        {extraInfo && (
          <p className="text-xs text-muted-foreground mt-2">{extraInfo}</p>
        )}
      </CardContent>
    </Card>
  );
}
