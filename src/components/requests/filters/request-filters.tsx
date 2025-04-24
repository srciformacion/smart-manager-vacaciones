
import React from "react";
import { RequestType, RequestStatus } from "@/types";
import { SearchInput } from "../search/search-input";

interface RequestFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: RequestStatus | "all";
  onStatusChange: (value: RequestStatus | "all") => void;
  typeFilter: RequestType | "all";
  onTypeChange: (value: RequestType | "all") => void;
}

export function RequestFilters({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  typeFilter,
  onTypeChange,
}: RequestFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row gap-2">
      <SearchInput
        value={searchTerm}
        onChange={onSearchChange}
        placeholder="Buscar..."
      />
      
      <select
        value={statusFilter}
        onChange={(e) => onStatusChange(e.target.value as RequestStatus | "all")}
        className="px-3 py-2 rounded-md border border-input bg-background text-sm"
      >
        <option value="all">Todos los estados</option>
        <option value="pending">Pendiente</option>
        <option value="approved">Aprobado</option>
        <option value="rejected">Rechazado</option>
        <option value="moreInfo">Más información</option>
      </select>
      
      <select
        value={typeFilter}
        onChange={(e) => onTypeChange(e.target.value as RequestType | "all")}
        className="px-3 py-2 rounded-md border border-input bg-background text-sm"
      >
        <option value="all">Todos los tipos</option>
        <option value="vacation">Vacaciones</option>
        <option value="personalDay">Asuntos propios</option>
        <option value="leave">Permisos justificados</option>
      </select>
    </div>
  );
}
