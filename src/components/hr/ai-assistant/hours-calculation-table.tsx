
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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { HoursCalculationResult } from "@/utils/ai/AIService";
import { exampleWorkers } from "@/data/example-users";

interface HoursCalculationTableProps {
  calculations: HoursCalculationResult[];
}

export function HoursCalculationTable({ calculations }: HoursCalculationTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "deficit" | "balanced" | "excess">("all");
  
  // Get workers data
  const workers = exampleWorkers;
  
  const getWorkerName = (userId: string): string => {
    const worker = workers.find(w => w.id === userId);
    return worker ? worker.name : "Desconocido";
  };
  
  const getWorkerDepartment = (userId: string): string => {
    const worker = workers.find(w => w.id === userId);
    return worker ? worker.department : "Desconocido";
  };
  
  // Filter calculations
  const filteredCalculations = calculations.filter(item => {
    const workerName = getWorkerName(item.userId);
    const matchesSearch = !searchTerm || 
      workerName.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesFilter = filterStatus === "all" || 
      item.status === filterStatus;
      
    return matchesSearch && matchesFilter;
  });
  
  const getStatusColor = (status: string): string => {
    switch (status) {
      case "deficit": return "bg-red-500";
      case "balanced": return "bg-green-500";
      case "excess": return "bg-blue-500";
      default: return "bg-gray-500";
    }
  };
  
  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar por trabajador..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant={filterStatus === "all" ? "default" : "outline"} 
            size="sm" 
            onClick={() => setFilterStatus("all")}
          >
            Todos
          </Button>
          <Button 
            variant={filterStatus === "deficit" ? "default" : "outline"} 
            size="sm" 
            onClick={() => setFilterStatus("deficit")}
            className="border-red-200"
          >
            Déficit
          </Button>
          <Button 
            variant={filterStatus === "balanced" ? "default" : "outline"} 
            size="sm"
            onClick={() => setFilterStatus("balanced")}
            className="border-green-200"
          >
            Balanceados
          </Button>
          <Button 
            variant={filterStatus === "excess" ? "default" : "outline"} 
            size="sm"
            onClick={() => setFilterStatus("excess")}
            className="border-blue-200"
          >
            Exceso
          </Button>
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Trabajador</TableHead>
              <TableHead className="hidden md:table-cell">Departamento</TableHead>
              <TableHead className="text-right">Trabajadas</TableHead>
              <TableHead className="text-right">Esperadas</TableHead>
              <TableHead className="text-right">Diferencia</TableHead>
              <TableHead>Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCalculations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24">
                  No se encontraron resultados
                </TableCell>
              </TableRow>
            ) : (
              filteredCalculations.map((item) => {
                const workerName = getWorkerName(item.userId);
                const department = getWorkerDepartment(item.userId);
                
                return (
                  <TableRow key={item.userId}>
                    <TableCell className="font-medium">
                      {workerName}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {department}
                    </TableCell>
                    <TableCell className="text-right">
                      {item.workedHours}h
                    </TableCell>
                    <TableCell className="text-right">
                      {item.expectedHours}h
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      <span className={
                        item.adjustedDifference > 0 
                          ? "text-blue-600"
                          : item.adjustedDifference < 0 
                            ? "text-red-600" 
                            : ""
                      }>
                        {item.adjustedDifference > 0 ? "+" : ""}
                        {item.adjustedDifference}h
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(item.status)}>
                        {item.status === "deficit" && "Déficit"}
                        {item.status === "balanced" && "Balanceado"}
                        {item.status === "excess" && "Exceso"}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1 hidden md:block">
                        {item.explanation.substring(0, 50)}...
                      </p>
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
