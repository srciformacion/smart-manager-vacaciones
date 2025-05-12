
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface WorkersFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  departmentFilter: string | null;
  setDepartmentFilter: (value: string | null) => void;
  shiftFilter: string | null;
  setShiftFilter: (value: string | null) => void;
  departments: string[];
  shifts: string[];
  resetFilters: () => void;
  showResetButton: boolean;
  totalWorkers: number;
  filteredCount: number;
}

export function WorkersFilters({
  searchTerm,
  setSearchTerm,
  departmentFilter,
  setDepartmentFilter,
  shiftFilter,
  setShiftFilter,
  departments,
  shifts,
  resetFilters,
  showResetButton,
  totalWorkers,
  filteredCount
}: WorkersFiltersProps) {
  return (
    <>
      <div className="grid gap-4 mt-4 md:grid-cols-4">
        <div className="relative col-span-2">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre, email o departamento"
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Select 
          value={departmentFilter || "all"} 
          onValueChange={(value) => setDepartmentFilter(value === "all" ? null : value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filtrar por departamento" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los departamentos</SelectItem>
            {departments.map((dept) => (
              <SelectItem key={dept} value={dept}>{dept}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select 
          value={shiftFilter || "all"} 
          onValueChange={(value) => setShiftFilter(value === "all" ? null : value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filtrar por turno" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los turnos</SelectItem>
            {shifts.map((shift) => (
              <SelectItem key={shift} value={shift}>{shift}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {showResetButton && (
          <div className="md:col-span-4 flex justify-end">
            <Button variant="outline" onClick={resetFilters} size="sm">
              Quitar todos los filtros
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
