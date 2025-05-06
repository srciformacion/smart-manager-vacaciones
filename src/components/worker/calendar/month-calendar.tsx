
import React, { useEffect } from 'react';
import { CalendarShift } from '@/types/calendar';
import { supabase } from '@/integrations/supabase/client';
import { CalendarGrid } from './calendar-grid';

interface MonthCalendarProps {
  currentDate: Date;
  shifts: CalendarShift[];
  onShiftEdit?: (shift: CalendarShift) => Promise<any>;
}

export function MonthCalendar({ currentDate, shifts, onShiftEdit }: MonthCalendarProps) {
  // Determine if we're using demo data
  const isDemoData = shifts.some(shift => 
    shift.id.startsWith('demo-') || shift.id.startsWith('1-'));

  // Listen for changes in shifts from Supabase (only for non-demo users)
  useEffect(() => {
    if (isDemoData) {
      return; // Don't listen for real-time changes for demo data
    }
    
    // Set up channel to listen for real-time changes
    const channel = supabase
      .channel('calendar-shifts-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'calendar_shifts' 
        }, 
        (payload) => {
          console.log('Shift change detected:', payload);
        }
      )
      .subscribe();
      
    // Clean up subscription when unmounting
    return () => {
      supabase.removeChannel(channel);
    };
  }, [isDemoData, currentDate]);

  return (
    <CalendarGrid 
      currentDate={currentDate}
      shifts={shifts}
      onShiftEdit={onShiftEdit}
    />
  );
}
