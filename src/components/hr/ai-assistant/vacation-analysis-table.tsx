
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Search, MoreHorizontal, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { AIAnalysisResult } from "@/utils/ai/AIService";
import { exampleRequests } from "@/data/example-requests";
import { exampleWorkers } from "@/data/example-users";
import { Request, User } from "@/types";

interface VacationAnalysisTableProps {
  analysis: AIAnalysisResult[];
  onApproveRecommendation: (requestId: string, recommendation: string) => void;
}

export function VacationAnalysisTable({ analysis, onApproveRecommendation }: VacationAnalysisTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredRecommendation, setFilteredRecommendation] = useState<string | null>(null);
  
  // Get requests and workers
  const requests = exampleRequests;
  const workers = exampleWorkers;
  
  const getRequestDetails = (requestId: string): Request | undefined => {
    return requests.find(r => r.id === requestId);
  };
  
  const getWorkerName = (userId: string): string => {
    const worker = workers.find(w => w.id === userId);
    return worker ? worker.name : "Desconocido";
  };
  
  // Filter analysis results
  const filteredAnalysis = analysis.filter(item => {
    const request = getRequestDetails(item.requestId);
    if (!request) return false;
    
    const workerName = getWorkerName(request.userId);
    const matchesSearch = !searchTerm || 
      workerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.requestId.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesRecommendation = !filteredRecommendation || 
      item.recommendation === filteredRecommendation;
      
    return matchesSearch && matchesRecommendation;
  });
  
  const getSeverityColor = (severity: string): string => {
    switch (severity) {
      case "high": return "bg-red-500 text-white";
      case "medium": return "bg-yellow-500";
      case "low": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };
  
  const getRecommendationIcon = (recommendation: string) => {
    switch (recommendation) {
      case "approve": return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "deny": return <XCircle className="h-4 w-4 text-red-500" />;
      case "review": return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default: return null;
    }
  };
  
  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar por trabajador o ID..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full sm:w-auto">
              {filteredRecommendation ? (
                <span>
                  {filteredRecommendation === "approve" && "Aprobaciones"}
                  {filteredRecommendation === "deny" && "Denegaciones"}
                  {filteredRecommendation === "review" && "Revisión Manual"}
                </span>
              ) : (
                "Filtrar por recomendación"
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => setFilteredRecommendation(null)}>
                <Check className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>Todas</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilteredRecommendation("approve")}>
                <Check className="mr-2 h-4 w-4 text-green-500" />
                <span>Aprobaciones</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilteredRecommendation("deny")}>
                <X className="mr-2 h-4 w-4 text-red-500" />
                <span>Denegaciones</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilteredRecommendation("review")}>
                <AlertTriangle className="mr-2 h-4 w-4 text-yellow-500" />
                <span>Revisión Manual</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="whitespace-nowrap">Solicitud</TableHead>
              <TableHead className="whitespace-nowrap">Trabajador</TableHead>
              <TableHead className="whitespace-nowrap">Fechas</TableHead>
              <TableHead className="hidden md:table-cell">Recomendación</TableHead>
              <TableHead>Explicación</TableHead>
              <TableHead className="hidden md:table-cell">Prioridad</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAnalysis.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center h-24">
                  No se han encontrado resultados
                </TableCell>
              </TableRow>
            ) : (
              filteredAnalysis.map((item) => {
                const request = getRequestDetails(item.requestId);
                if (!request) return null;
                
                const workerName = getWorkerName(request.userId);
                
                return (
                  <TableRow key={item.requestId}>
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
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
