
import { useState, useMemo } from 'react';
import { User } from "@/types";

interface UseWorkersFilterOptions {
  workers: User[];
  workersPerPage?: number;
}

export function useWorkersFilter({ workers, workersPerPage = 10 }: UseWorkersFilterOptions) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [departmentFilter, setDepartmentFilter] = useState<string | null>(null);
  const [shiftFilter, setShiftFilter] = useState<string | null>(null);
  
  // Extract unique departments
  const departments = useMemo(() => 
    Array.from(new Set(workers.map(worker => worker.department))),
    [workers]
  );
  
  // Extract unique shifts
  const shifts = useMemo(() => 
    Array.from(new Set(workers.map(worker => worker.shift))),
    [workers]
  );
  
  // Apply filters
  const filteredWorkers = useMemo(() => 
    workers.filter(worker => 
      (searchTerm === '' || 
       worker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       worker.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
       worker.department.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (departmentFilter === null || worker.department === departmentFilter) &&
      (shiftFilter === null || worker.shift === shiftFilter)
    ),
    [workers, searchTerm, departmentFilter, shiftFilter]
  );
  
  // Paginate results
  const totalPages = Math.ceil(filteredWorkers.length / workersPerPage);
  
  const paginatedWorkers = useMemo(() => {
    const indexOfLastWorker = currentPage * workersPerPage;
    const indexOfFirstWorker = indexOfLastWorker - workersPerPage;
    return filteredWorkers.slice(indexOfFirstWorker, indexOfLastWorker);
  }, [filteredWorkers, currentPage, workersPerPage]);
  
  const resetFilters = () => {
    setSearchTerm('');
    setDepartmentFilter(null);
    setShiftFilter(null);
    setCurrentPage(1);
  };
  
  const showResetButton = searchTerm || departmentFilter || shiftFilter;
  
  return {
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    departmentFilter,
    setDepartmentFilter,
    shiftFilter,
    setShiftFilter,
    departments,
    shifts,
    filteredWorkers,
    paginatedWorkers,
    totalPages,
    resetFilters,
    showResetButton
  };
}
