
import React, { useState, useEffect } from 'react';
import { addDays, format, getDay, startOfMonth, endOfMonth, isToday, isSameMonth } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarShift, ShiftType } from '@/types/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pen, Clock, Calendar, Briefcase } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

interface MonthCalendarProps {
  currentDate: Date;
  shifts: CalendarShift[];
  onShiftEdit?: (shift: CalendarShift) => Promise<any>;
}

export function MonthCalendar({ currentDate, shifts, onShiftEdit }: MonthCalendarProps) {
  const [selectedShift, setSelectedShift] = useState<CalendarShift | null>(null);
  const [editedShift, setEditedShift] = useState<CalendarShift | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [localShifts, setLocalShifts] = useState<CalendarShift[]>(shifts);
  
  // Update local shifts when prop changes
  useEffect(() => {
    setLocalShifts(shifts);
  }, [shifts]);

  // Determinar si estamos usando datos demo
  const isDemoData = shifts.some(shift => 
    shift.id.startsWith('demo-') || shift.id.startsWith('1-'));

  // Escuchar cambios en los turnos desde Supabase (solo para usuarios no demo)
  useEffect(() => {
    if (isDemoData) {
      return; // No escuchamos cambios en tiempo real para datos de demostración
    }
    
    // Configurar canal para escuchar cambios en tiempo real
    const channel = supabase
      .channel('calendar-shifts-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'calendar_shifts' 
        }, 
        (payload) => {
          console.log('Cambio detectado en turnos:', payload);
        }
      )
      .subscribe();
      
    // Limpiar suscripción al desmontar
    return () => {
      supabase.removeChannel(channel);
    };
  }, [isDemoData, currentDate]);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const startDate = monthStart;
  const endDate = monthEnd;

  // Array de fechas para mostrar en el calendario
  const dateRange = [];
  let currentDatePointer = startDate;
  
  // Ajustar para que la semana empiece en lunes
  while (getDay(currentDatePointer) !== 1 && currentDatePointer.getTime() > monthStart.getTime() - 7 * 24 * 60 * 60 * 1000) {
    currentDatePointer = addDays(currentDatePointer, -1);
  }
  
  for (let i = 0; i < 42; i++) {
    dateRange.push(new Date(currentDatePointer));
    currentDatePointer = addDays(currentDatePointer, 1);
  }

  const handleDayClick = (date: Date) => {
    // Buscar si ya existe un shift para esa fecha
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
      // Crear un nuevo shift si no existe
      const newShift: CalendarShift = {
        id: `temp-${Date.now()}`,
        userId: shifts[0]?.userId || "current-user", // Usar el userId del primer turno o valor predeterminado
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

  const handleSaveClick = async () => {
    if (editedShift && onShiftEdit) {
      setIsSaving(true);
      
      try {
        const result = await onShiftEdit(editedShift);
        
        if (result) {
          setSelectedShift(result);
          toast.success("Turno guardado correctamente");
        } else {
          // Si onShiftEdit ya maneja toasts de error, esto es redundante
          // pero lo dejamos por seguridad
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
          <div className="grid grid-cols-7 gap-1 mb-2">
            {DAYS.map((day, idx) => (
              <div key={idx} className="text-center text-sm font-medium py-1">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {dateRange.map((date, idx) => {
              const shift = localShifts.find(s => 
                s.date.getFullYear() === date.getFullYear() && 
                s.date.getMonth() === date.getMonth() && 
                s.date.getDate() === date.getDate()
              );
              
              const isCurrentMonth = isSameMonth(date, currentDate);
              
              return (
                <div 
                  key={idx}
                  onClick={() => handleDayClick(date)}
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
                      <span className="font-medium">{
                        shift.type === "morning" ? "Mañana" :
                        shift.type === "afternoon" ? "Tarde" :
                        shift.type === "night" ? "Noche" :
                        shift.type === "24h" ? "24 Horas" :
                        shift.type === "free" ? "Libre" :
                        shift.type === "guard" ? "Guardia" :
                        shift.type === "oncall" ? "Localizado" :
                        shift.type === "training" ? "Formación" :
                        "No asignado"
                      }</span>
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
            })}
          </div>
        </CardContent>
      </Card>

      {/* Diálogo de detalle/edición de turno */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]" aria-labelledby="shift-dialog-title">
          <DialogHeader>
            <DialogTitle id="shift-dialog-title" className="flex justify-between items-center">
              <div>
                {isEditMode 
                  ? "Editar turno" 
                  : `Turno: ${selectedShift ? format(selectedShift.date, 'PPP', { locale: es }) : ""}`
                }
              </div>
              {!isEditMode && selectedShift && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleEditClick}
                  aria-label="Editar turno"
                >
                  <Pen className="h-4 w-4" aria-hidden="true" />
                </Button>
              )}
            </DialogTitle>
          </DialogHeader>

          {selectedShift && !isEditMode && (
            <div className="space-y-4">
              <div className="flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-muted-foreground" aria-hidden="true" />
                <span>{format(selectedShift.date, 'EEEE, d MMMM yyyy', { locale: es })}</span>
              </div>
              
              <div className="flex items-center">
                <Briefcase className="mr-2 h-5 w-5 text-muted-foreground" aria-hidden="true" />
                <Badge>
                  {selectedShift.type === "morning" ? "Mañana" :
                   selectedShift.type === "afternoon" ? "Tarde" :
                   selectedShift.type === "night" ? "Noche" :
                   selectedShift.type === "24h" ? "24 Horas" :
                   selectedShift.type === "free" ? "Libre" :
                   selectedShift.type === "guard" ? "Guardia" :
                   selectedShift.type === "oncall" ? "Localizado" :
                   selectedShift.type === "training" ? "Formación" :
                   "No asignado"
                  }
                </Badge>
              </div>
              
              {selectedShift.startTime && selectedShift.endTime && (
                <div className="flex items-center">
                  <Clock className="mr-2 h-5 w-5 text-muted-foreground" aria-hidden="true" />
                  <span>{selectedShift.startTime} - {selectedShift.endTime}</span>
                </div>
              )}
              
              {selectedShift.hours !== undefined && selectedShift.hours > 0 && (
                <div className="flex items-center">
                  <Clock className="mr-2 h-5 w-5 text-muted-foreground" aria-hidden="true" />
                  <span>{selectedShift.hours} horas</span>
                </div>
              )}
              
              {selectedShift.notes && (
                <div className="border rounded-md p-3 bg-muted/30">
                  <p className="text-sm">{selectedShift.notes}</p>
                </div>
              )}
              
              {selectedShift.isException && (
                <div className="border border-red-200 rounded-md p-3 bg-red-50">
                  <p className="text-sm font-medium text-red-800">Excepción: {selectedShift.exceptionReason}</p>
                </div>
              )}
            </div>
          )}
          
          {isEditMode && editedShift && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">Tipo de turno</Label>
                  <Select 
                    value={editedShift.type} 
                    onValueChange={(value: ShiftType) => 
                      setEditedShift({...editedShift, type: value, color: getShiftColor(value)})
                    }
                  >
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="morning">Mañana</SelectItem>
                      <SelectItem value="afternoon">Tarde</SelectItem>
                      <SelectItem value="night">Noche</SelectItem>
                      <SelectItem value="24h">24 Horas</SelectItem>
                      <SelectItem value="free">Libre</SelectItem>
                      <SelectItem value="guard">Guardia</SelectItem>
                      <SelectItem value="oncall">Localizado</SelectItem>
                      <SelectItem value="training">Formación</SelectItem>
                      <SelectItem value="unassigned">No asignado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="hours">Horas</Label>
                  <Input 
                    id="hours"
                    type="number"
                    step="0.5"
                    min="0"
                    value={editedShift.hours || 0}
                    onChange={(e) => setEditedShift({...editedShift, hours: parseFloat(e.target.value) || 0})}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startTime">Hora inicio</Label>
                  <Input 
                    id="startTime"
                    type="time"
                    value={editedShift.startTime || ""}
                    onChange={(e) => setEditedShift({...editedShift, startTime: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="endTime">Hora fin</Label>
                  <Input 
                    id="endTime"
                    type="time"
                    value={editedShift.endTime || ""}
                    onChange={(e) => setEditedShift({...editedShift, endTime: e.target.value})}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="notes">Notas</Label>
                <Textarea 
                  id="notes"
                  value={editedShift.notes || ""}
                  onChange={(e) => setEditedShift({...editedShift, notes: e.target.value})}
                  placeholder="Añadir notas sobre el turno..."
                />
              </div>
              
              <div className="flex justify-between mt-4">
                <Button 
                  variant="outline" 
                  onClick={handleCancelClick} 
                  disabled={isSaving}
                  aria-label="Cancelar edición"
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={handleSaveClick} 
                  disabled={isSaving}
                  aria-label="Guardar cambios del turno"
                >
                  {isSaving ? "Guardando..." : "Guardar"}
                </Button>
              </div>
            </div>
          )}
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
