
import React from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarShift } from '@/types/calendar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Pen, Clock, Calendar, Briefcase } from 'lucide-react';
import { getShiftTypeLabel } from '../utils/calendar-display-utils';

interface ShiftDetailViewProps {
  shift: CalendarShift;
  onEdit: () => void;
}

export function ShiftDetailView({ shift, onEdit }: ShiftDetailViewProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Calendar className="mr-2 h-5 w-5 text-muted-foreground" aria-hidden="true" />
          <span>{format(shift.date, 'EEEE, d MMMM yyyy', { locale: es })}</span>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onEdit}
          aria-label="Editar turno"
        >
          <Pen className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>
      
      <div className="flex items-center">
        <Briefcase className="mr-2 h-5 w-5 text-muted-foreground" aria-hidden="true" />
        <Badge>
          {getShiftTypeLabel(shift.type)}
        </Badge>
      </div>
      
      {shift.startTime && shift.endTime && (
        <div className="flex items-center">
          <Clock className="mr-2 h-5 w-5 text-muted-foreground" aria-hidden="true" />
          <span>{shift.startTime} - {shift.endTime}</span>
        </div>
      )}
      
      {shift.hours !== undefined && shift.hours > 0 && (
        <div className="flex items-center">
          <Clock className="mr-2 h-5 w-5 text-muted-foreground" aria-hidden="true" />
          <span>{shift.hours} horas</span>
        </div>
      )}
      
      {shift.notes && (
        <div className="border rounded-md p-3 bg-muted/30">
          <p className="text-sm">{shift.notes}</p>
        </div>
      )}
      
      {shift.isException && (
        <div className="border border-red-200 rounded-md p-3 bg-red-50">
          <p className="text-sm font-medium text-red-800">Excepción: {shift.exceptionReason}</p>
        </div>
      )}
    </div>
  );
}
