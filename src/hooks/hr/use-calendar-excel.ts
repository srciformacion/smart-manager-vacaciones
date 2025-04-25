
import { useState } from 'react';
import { CalendarShift } from '@/types/calendar';
import { User } from '@/types';
import { ExcelService } from '@/services/ExcelService';
import { toast } from 'sonner';

interface UseCalendarExcelProps {
  users: User[];
}

interface UseCalendarExcelReturn {
  importedShifts: CalendarShift[];
  isLoading: boolean;
  isPreviewMode: boolean;
  handleFileImport: (file: File) => Promise<void>;
  exportToExcel: (shifts: CalendarShift[], sheetName?: string) => void;
  confirmImport: () => void;
  cancelImport: () => void;
  updateShift: (shiftId: string, updates: Partial<CalendarShift>) => void;
}

export function useCalendarExcel({ users }: UseCalendarExcelProps): UseCalendarExcelReturn {
  const [importedShifts, setImportedShifts] = useState<CalendarShift[]>([]);
  const [originalShifts, setOriginalShifts] = useState<CalendarShift[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  /**
   * Handles file import selection
   */
  const handleFileImport = async (file: File) => {
    if (!file) return;
    
    setIsLoading(true);
    
    try {
      // Validate file type
      if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
        toast.error('El archivo debe ser de tipo Excel (.xlsx o .xls)');
        return;
      }
      
      // Import file
      const shifts = await ExcelService.importFromExcel(file);
      
      if (shifts.length === 0) {
        toast.error('No se encontraron datos en el archivo seleccionado');
        return;
      }
      
      // Store imported shifts
      setImportedShifts(shifts);
      setOriginalShifts(shifts);
      setIsPreviewMode(true);
      
      toast.success(`Se han importado ${shifts.length} turnos correctamente`);
    } catch (error) {
      console.error('Error importing Excel file:', error);
      toast.error('Error al importar el archivo Excel');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Exports shifts to Excel
   */
  const exportToExcel = (shifts: CalendarShift[], sheetName = 'Calendario') => {
    try {
      if (!shifts || shifts.length === 0) {
        toast.error('No hay datos para exportar');
        return;
      }
      
      const blob = ExcelService.exportToExcel(shifts, users, sheetName);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `calendario_turnos_${new Date().toISOString().split('T')[0]}.xlsx`;
      link.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      
      toast.success('Calendario exportado correctamente');
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      toast.error('Error al exportar a Excel');
    }
  };

  /**
   * Confirms the import and applies the changes
   */
  const confirmImport = () => {
    // Here we would typically save to database
    // For now we'll just update the state and show a success message
    toast.success(`Se han guardado ${importedShifts.length} turnos`);
    setIsPreviewMode(false);
    
    // In a real app, we would dispatch to store or call an API here
  };

  /**
   * Cancels the import and reverts changes
   */
  const cancelImport = () => {
    setImportedShifts([]);
    setOriginalShifts([]);
    setIsPreviewMode(false);
  };

  /**
   * Updates a specific shift in the preview
   */
  const updateShift = (shiftId: string, updates: Partial<CalendarShift>) => {
    setImportedShifts(prevShifts => 
      prevShifts.map(shift => 
        shift.id === shiftId ? { ...shift, ...updates } : shift
      )
    );
  };

  return {
    importedShifts,
    isLoading,
    isPreviewMode,
    handleFileImport,
    exportToExcel,
    confirmImport,
    cancelImport,
    updateShift
  };
}
