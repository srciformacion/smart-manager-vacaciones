
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AIAnalysisResult } from "@/utils/ai/AIService";
import { exampleRequests } from "@/data/example-requests";
import { exampleWorkers } from "@/data/example-users";
import { Request, User } from "@/types";
import { AnalysisFilters } from "./analysis-filters";
import { AnalysisTableRow } from "./analysis-table-row";
import { EmptyAnalysisState } from "./empty-analysis-state";

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
  
  return (
    <div>
      <AnalysisFilters 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filteredRecommendation={filteredRecommendation}
        setFilteredRecommendation={setFilteredRecommendation}
      />
      
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
              <EmptyAnalysisState />
            ) : (
              filteredAnalysis.map((item) => {
                const request = getRequestDetails(item.requestId);
                if (!request) return null;
                
                const workerName = getWorkerName(request.userId);
                
                return (
                  <AnalysisTableRow 
                    key={item.requestId}
                    item={item}
                    request={request}
                    workerName={workerName}
                    onApproveRecommendation={onApproveRecommendation}
                  />
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
