
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { CalendarShift, ShiftType } from '@/types/calendar';
import { CalendarHeader } from './components/calendar-header';
import { CalendarDay } from './components/calendar-day';
import { ShiftDialog } from './components/shift-dialog';
import { generateCalendarDays } from './utils/calendar-display-utils';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

interface CalendarGridProps {
  currentDate: Date;
  shifts: CalendarShift[];
  onShiftEdit?: (shift: CalendarShift) => Promise<any>;
}

export function CalendarGrid({ currentDate, shifts, onShiftEdit }: CalendarGridProps) {
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

  const dateRange = generateCalendarDays(currentDate);

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
        type: "unassigned" as ShiftType,
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

  return (
    <>
      <Card>
        <CardContent className="p-4">
          <CalendarHeader />
          
          <div className="grid grid-cols-7 gap-1">
            {dateRange.map((date, idx) => {
              const shift = localShifts.find(s => 
                s.date.getFullYear() === date.getFullYear() && 
                s.date.getMonth() === date.getMonth() && 
                s.date.getDate() === date.getDate()
              );
              
              return (
                <CalendarDay 
                  key={idx}
                  date={date}
                  currentMonth={currentDate}
                  shift={shift}
                  onClick={handleDayClick}
                />
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]" aria-labelledby="shift-dialog-title">
          <ShiftDialog 
            selectedShift={selectedShift}
            editedShift={editedShift}
            isEditMode={isEditMode}
            isSaving={isSaving}
            onEditClick={handleEditClick}
            onShiftChange={handleShiftChange}
            onSave={handleSaveClick}
            onCancel={handleCancelClick}
          />
        </DialogContent>
      </Dialog>
    </>
  );

  function getShiftColor(type: ShiftType) {
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
}
