
import React from 'react';
import { CalendarShift } from '@/types/calendar';
import { CalendarGridContainer } from './components/calendar-grid-container';

interface CalendarGridProps {
  currentDate: Date;
  shifts: CalendarShift[];
  onShiftEdit?: (shift: CalendarShift) => Promise<any>;
}

export function CalendarGrid({ currentDate, shifts, onShiftEdit }: CalendarGridProps) {
  return (
    <CalendarGridContainer 
      currentDate={currentDate}
      shifts={shifts}
      onShiftEdit={onShiftEdit}
    />
  );
}
