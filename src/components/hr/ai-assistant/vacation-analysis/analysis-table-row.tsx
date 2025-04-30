
import { Badge } from "@/components/ui/badge";
import { TableRow, TableCell } from "@/components/ui/table";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Check, X, MoreHorizontal, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { AIAnalysisResult } from "@/utils/ai/AIService";
import { Request, User } from "@/types";

interface AnalysisTableRowProps {
  item: AIAnalysisResult;
  request: Request;
  workerName: string;
  onApproveRecommendation: (requestId: string, recommendation: string) => void;
}

export function AnalysisTableRow({ item, request, workerName, onApproveRecommendation }: AnalysisTableRowProps) {
  
  const getRecommendationIcon = (recommendation: string) => {
    switch (recommendation) {
      case "approve": return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "deny": return <XCircle className="h-4 w-4 text-red-500" />;
      case "review": return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default: return null;
    }
  };
  
  const getSeverityColor = (severity: string): string => {
    switch (severity) {
      case "high": return "bg-red-500 text-white";
      case "medium": return "bg-yellow-500";
      case "low": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <TableRow>
      <TableCell className="font-medium">{item.requestId}</TableCell>
      <TableCell>{workerName}</TableCell>
      <TableCell className="whitespace-nowrap">
        {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
      </TableCell>
      <TableCell className="hidden md:table-cell">
        <div className="flex items-center gap-1">
          {getRecommendationIcon(item.recommendation)}
          <span>
            {item.recommendation === "approve" && "Aprobar"}
            {item.recommendation === "deny" && "Denegar"}
            {item.recommendation === "review" && "Revisar"}
          </span>
        </div>
      </TableCell>
      <TableCell className="max-w-xs">
        <div className="truncate md:line-clamp-2">{item.explanation}</div>
      </TableCell>
      <TableCell className="hidden md:table-cell">
        <Badge className={getSeverityColor(item.severity)}>
          {item.severity === "high" && "Alta"}
          {item.severity === "medium" && "Media"}
          {item.severity === "low" && "Baja"}
        </Badge>
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Abrir menú</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {item.recommendation === "approve" && (
              <DropdownMenuItem onClick={() => onApproveRecommendation(item.requestId, "approve")}>
                <Check className="mr-2 h-4 w-4" />
                <span>Aprobar solicitud</span>
              </DropdownMenuItem>
            )}
            {item.recommendation === "deny" && (
              <DropdownMenuItem onClick={() => onApproveRecommendation(item.requestId, "deny")}>
                <X className="mr-2 h-4 w-4" />
                <span>Denegar solicitud</span>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem>
              <AlertTriangle className="mr-2 h-4 w-4" />
              <span>Ver detalles</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
