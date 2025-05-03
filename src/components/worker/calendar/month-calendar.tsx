
import React from 'react';
import { addDays, format, getDay, startOfMonth, endOfMonth, isToday, isSameMonth } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarShift } from '@/types/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { toast } from "sonner";

interface MonthCalendarProps {
  currentDate: Date;
  shifts: CalendarShift[];
  onShiftEdit?: (shift: CalendarShift) => Promise<any>;
}

export const MonthCalendar = ({ currentDate, shifts, onShiftEdit }: MonthCalendarProps) => {
  const [selectedShift, setSelectedShift] = useState<CalendarShift | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedShift, setEditedShift] = useState<CalendarShift | null>(null);

  // Días de la semana
  const weekDays = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do'];

  // Obtener las fechas para el calendario del mes actual
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = monthStart;
  const endDate = monthEnd;

  // Calcular los días que se muestran en el calendario
  const calendarDays = [];
  let day = startDate;
  
  // Ajustar el día de inicio para que comience en lunes (1)
  const startDay = getDay(startDate) || 7; // Si es domingo (0), lo convierte a 7
  for (let i = 1; i < startDay; i++) {
    calendarDays.push(null); // Días vacíos al inicio
  }
  
  // Añadir todos los días del mes
  while (day <= endDate) {
    calendarDays.push(day);
    day = addDays(day, 1);
  }

  // Obtener el turno para una fecha específica
  const getShiftForDate = (date: Date | null) => {
    if (!date) return null;
    
    return shifts.find(shift => 
      format(shift.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
  };

  // Abrir diálogo de edición de turno
  const openShiftDialog = (shift: CalendarShift) => {
    setSelectedShift(shift);
    setEditedShift({...shift});
    setIsEditing(true);
  };

  // Guardar cambios en el turno
  const saveShiftChanges = async () => {
    if (!editedShift) return;
    
    try {
      if (onShiftEdit) {
        await onShiftEdit(editedShift);
        // Actualizar el turno en el array local
        const updatedShifts = shifts.map(s => 
          s.id === editedShift.id ? editedShift : s
        );
        // Actualizamos la UI
        toast.success("Turno actualizado correctamente");
      }
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving shift:", error);
      toast.error("Error al guardar el turno");
    }
  };

  return (
    <>
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-7 gap-1">
            {/* Cabecera con los días de la semana */}
            {weekDays.map(day => (
              <div key={day} className="text-center font-medium py-2">
                {day}
              </div>
            ))}
            
            {/* Días del calendario */}
            {calendarDays.map((date, i) => {
              const shift = getShiftForDate(date);
              const isCurrentMonth = date ? isSameMonth(date, currentDate) : false;
              
              return (
                <div 
                  key={i} 
                  className={`min-h-[80px] p-1 border rounded-md ${
                    date && isToday(date) 
                      ? 'bg-muted border-primary' 
                      : isCurrentMonth 
                        ? 'bg-card' 
                        : 'bg-muted-foreground/10'
                  }`}
                  onClick={() => shift && openShiftDialog(shift)}
                >
                  {date ? (
                    <>
                      <div className="text-xs font-medium mb-1">
                        {format(date, 'd')}
                      </div>
                      
                      {shift ? (
                        <div className="space-y-1 text-xs">
                          <Badge 
                            variant="outline" 
                            className={`w-full justify-center bg-${shift.color}-100 border-${shift.color}-300 text-${shift.color}-600`}
                          >
                            {shift.type === 'morning' && 'Mañana'}
                            {shift.type === 'afternoon' && 'Tarde'}
                            {shift.type === 'night' && 'Noche'}
                            {shift.type === 'free' && 'Libre'}
                            {shift.type === 'unassigned' && 'Sin asignar'}
                            {shift.type === '24h' && '24h'}
                            {shift.type === 'guard' && 'Guardia'}
                            {shift.type === 'training' && 'Formación'}
                          </Badge>
                          
                          {shift.startTime && shift.endTime && (
                            <div className="text-center text-muted-foreground">
                              {shift.startTime} - {shift.endTime}
                            </div>
                          )}
                          
                          {shift.hours > 0 && (
                            <div className="text-center font-medium">
                              {shift.hours}h
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          -
                        </div>
                      )}
                    </>
                  ) : null}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Diálogo de edición de turno */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar turno</DialogTitle>
          </DialogHeader>
          
          {editedShift && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="date">Fecha</Label>
                <Input 
                  id="date" 
                  value={format(editedShift.date, 'yyyy-MM-dd')} 
                  disabled 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="type">Tipo de turno</Label>
                <Select 
                  value={editedShift.type} 
                  onValueChange={(value) => 
                    setEditedShift({...editedShift, type: value, color: getShiftColor(value)})
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">Mañana</SelectItem>
                    <SelectItem value="afternoon">Tarde</SelectItem>
                    <SelectItem value="night">Noche</SelectItem>
                    <SelectItem value="24h">24 horas</SelectItem>
                    <SelectItem value="free">Libre</SelectItem>
                    <SelectItem value="guard">Guardia</SelectItem>
                    <SelectItem value="unassigned">Sin asignar</SelectItem>
                    <SelectItem value="training">Formación</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startTime">Hora inicio</Label>
                  <Input 
                    id="startTime" 
                    value={editedShift.startTime || ""} 
                    onChange={(e) => setEditedShift({...editedShift, startTime: e.target.value})} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endTime">Hora fin</Label>
                  <Input 
                    id="endTime" 
                    value={editedShift.endTime || ""} 
                    onChange={(e) => setEditedShift({...editedShift, endTime: e.target.value})} 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="hours">Horas</Label>
                <Input 
                  id="hours" 
                  type="number" 
                  value={editedShift.hours || 0} 
                  onChange={(e) => setEditedShift({...editedShift, hours: parseFloat(e.target.value)})} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">Notas</Label>
                <Input 
                  id="notes" 
                  value={editedShift.notes || ""} 
                  onChange={(e) => setEditedShift({...editedShift, notes: e.target.value})} 
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsEditing(false)}>
              Cancelar
            </Button>
            <Button onClick={saveShiftChanges}>
              Guardar cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );

  function getShiftColor(type: string): any {
    switch (type) {
      case "morning": return "blue";
      case "afternoon": return "amber";
      case "night": return "indigo";
      case "24h": return "red";
      case "free": return "green";
      case "guard": return "purple";
      case "unassigned": return "gray";
      case "training": return "orange";
      default: return "gray";
    }
  }
};
