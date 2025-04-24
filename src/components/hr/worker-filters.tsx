
import React from "react";
import { WorkGroup, ShiftType } from "@/types";
import { SearchInput } from "./search-input";

interface WorkerFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  departmentFilter: string | "all";
  onDepartmentChange: (value: string) => void;
  groupFilter: WorkGroup | "all";
  onGroupChange: (value: WorkGroup | "all") => void;
  shiftFilter: ShiftType | "all";
  onShiftChange: (value: ShiftType | "all") => void;
  departments: string[];
  groups: WorkGroup[];
  shifts: ShiftType[];
}

export function WorkerFilters({
  searchTerm,
  onSearchChange,
  departmentFilter,
  onDepartmentChange,
  groupFilter,
  onGroupChange,
  shiftFilter,
  onShiftChange,
  departments,
  groups,
  shifts,
}: WorkerFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row gap-3 mb-6">
      <SearchInput 
        value={searchTerm} 
        onChange={onSearchChange}
        placeholder="Buscar trabajador..."
      />

      <select
        value={departmentFilter}
        onChange={(e) => onDepartmentChange(e.target.value)}
        className="px-3 py-2 rounded-md border border-input bg-background text-sm"
      >
        <option value="all">Todos los departamentos</option>
        {departments.map((dept) => (
          <option key={dept} value={dept}>
            {dept}
          </option>
        ))}
      </select>

      <select
        value={groupFilter}
        onChange={(e) => onGroupChange(e.target.value as WorkGroup | "all")}
        className="px-3 py-2 rounded-md border border-input bg-background text-sm"
      >
        <option value="all">Todos los grupos</option>
        {groups.map((group) => (
          <option key={group} value={group}>
            {group}
          </option>
        ))}
      </select>

      <select
        value={shiftFilter}
        onChange={(e) => onShiftChange(e.target.value as ShiftType | "all")}
        className="px-3 py-2 rounded-md border border-input bg-background text-sm"
      >
        <option value="all">Todos los turnos</option>
        {shifts.map((shift) => (
          <option key={shift} value={shift}>
            {shift}
          </option>
        ))}
      </select>
    </div>
  );
}
