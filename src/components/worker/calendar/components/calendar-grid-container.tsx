
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { CalendarShift } from '@/types/calendar';
import { CalendarHeader } from './calendar-header';
import { CalendarDay } from './calendar-day';
import { ShiftDialog } from './shift-dialog';
import { generateCalendarDays } from '../utils/calendar-display-utils';
import { CalendarProvider, useCalendarContext } from '../context/CalendarContext';
import { toast } from 'sonner';

interface CalendarGridContainerProps {
  currentDate: Date;
  shifts: CalendarShift[];
  onShiftEdit?: (shift: CalendarShift) => Promise<any>;
}

export function CalendarGridContainer({ 
  currentDate, 
  shifts, 
  onShiftEdit 
}: CalendarGridContainerProps) {
  return (
    <CalendarProvider shifts={shifts} onShiftEdit={onShiftEdit}>
      <CalendarGridInner currentDate={currentDate} />
    </CalendarProvider>
  );
}

interface CalendarGridInnerProps {
  currentDate: Date;
}

function CalendarGridInner({ currentDate }: CalendarGridInnerProps) {
  const { 
    isDialogOpen, 
    setIsDialogOpen,
    selectedShift,
    editedShift,
    isEditMode,
    isSaving,
    localShifts,
    handleDayClick,
    handleEditClick,
    handleShiftChange,
    handleSaveClick,
    handleCancelClick
  } = useCalendarContext();

  const dateRange = generateCalendarDays(currentDate);

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
}
