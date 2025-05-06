
import React from 'react';
import { format, isToday, isSameMonth } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarShift } from '@/types/calendar';
import { getShiftTypeLabel } from '../utils/calendar-display-utils';

interface CalendarDayProps {
  date: Date;
  currentMonth: Date;
  shift?: CalendarShift;
  onClick: (date: Date) => void;
}

export function CalendarDay({ date, currentMonth, shift, onClick }: CalendarDayProps) {
  const isCurrentMonth = isSameMonth(date, currentMonth);
  
  return (
    <div 
      onClick={() => onClick(date)}
      className={`
        min-h-[80px] p-1 border rounded-md flex flex-col cursor-pointer
        ${isCurrentMonth ? "bg-white" : "bg-gray-50"}
        ${isToday(date) ? "border-blue-500 border-2" : "border-gray-200"}
        hover:border-blue-300
      `}
      aria-label={`Día ${format(date, 'd')} de ${format(date, 'MMMM', { locale: es })}`}
    >
      <div className="text-right text-sm">
        <span className={`
          ${!isCurrentMonth && "text-gray-400"}
          ${isToday(date) && "font-bold text-blue-600"}
        `}>
          {format(date, 'd')}
        </span>
      </div>
      
      {shift && (
        <div className={`
          mt-1 p-1 text-xs rounded-sm flex-grow flex flex-col
          bg-${shift.color}-100 text-${shift.color}-800
          ${shift.isException && "border border-red-500"}
        `}>
          <span className="font-medium">{getShiftTypeLabel(shift.type)}</span>
          {shift.startTime && shift.endTime && (
            <span className="text-[10px]">{shift.startTime}-{shift.endTime}</span>
          )}
          {shift.hours && shift.hours > 0 && (
            <span className="text-[10px]">{shift.hours}h</span>
          )}
        </div>
      )}
    </div>
  );
}
