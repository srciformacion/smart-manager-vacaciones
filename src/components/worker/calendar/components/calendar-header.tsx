
import React from 'react';
import { DAYS_OF_WEEK } from '../utils/calendar-display-utils';

export function CalendarHeader() {
  return (
    <div className="grid grid-cols-7 gap-1 mb-2">
      {DAYS_OF_WEEK.map((day, idx) => (
        <div key={idx} className="text-center text-sm font-medium py-1">
          {day}
        </div>
      ))}
    </div>
  );
}
