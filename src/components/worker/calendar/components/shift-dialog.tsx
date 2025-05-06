
import React from 'react';
import { CalendarShift, ShiftType } from '@/types/calendar';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ShiftDetailView } from './shift-detail-view';
import { ShiftEditForm } from './shift-edit-form';

interface ShiftDialogProps {
  selectedShift: CalendarShift | null;
  editedShift: CalendarShift | null;
  isEditMode: boolean;
  isSaving: boolean;
  onEditClick: () => void;
  onShiftChange: (shift: CalendarShift) => void;
  onSave: () => void;
  onCancel: () => void;
}

export function ShiftDialog({ 
  selectedShift, 
  editedShift, 
  isEditMode, 
  isSaving,
  onEditClick, 
  onShiftChange,
  onSave,
  onCancel
}: ShiftDialogProps) {
  if (!selectedShift) return null;
  
  return (
    <>
      <DialogHeader>
        <DialogTitle id="shift-dialog-title" className="flex justify-between items-center">
          {isEditMode 
            ? "Editar turno" 
            : "Detalle del turno"
          }
        </DialogTitle>
      </DialogHeader>

      {!isEditMode && (
        <ShiftDetailView 
          shift={selectedShift}
          onEdit={onEditClick}
        />
      )}
      
      {isEditMode && editedShift && (
        <ShiftEditForm 
          shift={editedShift}
          isLoading={isSaving}
          onShiftChange={onShiftChange}
          onSave={onSave}
          onCancel={onCancel}
        />
      )}
    </>
  );
}
