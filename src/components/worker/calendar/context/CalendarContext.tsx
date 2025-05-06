import React, { createContext, useState, useContext } from 'react';
import { CalendarShift } from '@/types/calendar';
import { toast } from 'sonner';

type CalendarContextType = {
  selectedShift: CalendarShift | null;
  setSelectedShift: React.Dispatch<React.SetStateAction<CalendarShift | null>>;
  editedShift: CalendarShift | null;
  setEditedShift: React.Dispatch<React.SetStateAction<CalendarShift | null>>;
  isDialogOpen: boolean;
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isEditMode: boolean;
  setIsEditMode: React.Dispatch<React.SetStateAction<boolean>>;
  isSaving: boolean;
  setIsSaving: React.Dispatch<React.SetStateAction<boolean>>;
  localShifts: CalendarShift[];
  setLocalShifts: React.Dispatch<React.SetStateAction<CalendarShift[]>>;
  handleDayClick: (date: Date) => void;
  handleEditClick: () => void;
  handleShiftChange: (updatedShift: CalendarShift) => void;
  handleSaveClick: () => Promise<void>;
  handleCancelClick: () => void;
  handleCloseDialog: () => void;
};

const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

interface CalendarProviderProps {
  children: React.ReactNode;
  shifts: CalendarShift[];
  onShiftEdit?: (shift: CalendarShift) => Promise<any>;
}

export const CalendarProvider: React.FC<CalendarProviderProps> = ({ 
  children, 
  shifts, 
  onShiftEdit 
}) => {
  const [selectedShift, setSelectedShift] = useState<CalendarShift | null>(null);
  const [editedShift, setEditedShift] = useState<CalendarShift | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [localShifts, setLocalShifts] = useState<CalendarShift[]>(shifts);
  
  // Update local shifts when prop changes
  React.useEffect(() => {
    setLocalShifts(shifts);
  }, [shifts]);

  const handleDayClick = (date: Date) => {
    // Look for existing shift on this date
    const shift = localShifts.find(s => 
      s.date.getFullYear() === date.getFullYear() && 
      s.date.getMonth() === date.getMonth() && 
      s.date.getDate() === date.getDate()
    );
    
    if (shift) {
      setSelectedShift(shift);
      setIsDialogOpen(true);
      setIsEditMode(false);
    } else {
      // Create a new shift if none exists
      const newShift: CalendarShift = {
        id: `temp-${Date.now()}`,
        userId: shifts[0]?.userId || "current-user", // Use userId from first shift or default
        date,
        type: "unassigned",
        color: getShiftColor("unassigned"),
        hours: 0,
        startTime: "08:00",
        endTime: "15:00"
      };
      
      setSelectedShift(newShift);
      setEditedShift(newShift);
      setIsDialogOpen(true);
      setIsEditMode(true);
    }
  };

  const handleEditClick = () => {
    if (selectedShift) {
      setEditedShift({ ...selectedShift });
      setIsEditMode(true);
    }
  };

  const handleShiftChange = (updatedShift: CalendarShift) => {
    setEditedShift(updatedShift);
  };

  const handleSaveClick = async () => {
    if (editedShift && onShiftEdit) {
      setIsSaving(true);
      
      try {
        const result = await onShiftEdit(editedShift);
        
        if (result) {
          setSelectedShift(result);
          toast.success("Turno guardado correctamente");
        } else {
          toast.error("No se pudo guardar el turno");
        }
        
        setIsEditMode(false);
      } catch (error) {
        console.error("Error al guardar turno:", error);
        toast.error("Error al guardar el turno");
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleCancelClick = () => {
    setIsEditMode(false);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedShift(null);
    setEditedShift(null);
    setIsEditMode(false);
  };

  const contextValue = {
    selectedShift,
    setSelectedShift,
    editedShift,
    setEditedShift,
    isDialogOpen,
    setIsDialogOpen,
    isEditMode,
    setIsEditMode,
    isSaving,
    setIsSaving,
    localShifts,
    setLocalShifts,
    handleDayClick,
    handleEditClick,
    handleShiftChange,
    handleSaveClick,
    handleCancelClick,
    handleCloseDialog
  };

  return (
    <CalendarContext.Provider value={contextValue}>
      {children}
    </CalendarContext.Provider>
  );

  function getShiftColor(type: string) {
    switch (type) {
      case "morning": return "blue";
      case "afternoon": return "amber";
      case "night": return "indigo";
      case "24h": return "red";
      case "free": return "green";
      case "guard": return "purple";
      case "unassigned": return "gray";
      case "training": return "orange";
      case "special": return "yellow";
      case "oncall": return "teal";
      case "custom": return "pink";
      default: return "gray";
    }
  }
};

export const useCalendarContext = () => {
  const context = useContext(CalendarContext);
  
  if (context === undefined) {
    throw new Error("useCalendarContext must be used within a CalendarProvider");
  }
  
  return context;
};

export default CalendarContext;
