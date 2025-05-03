
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
import { Pen, X, Clock, Calendar, Briefcase } from 'lucide-react';
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

  // Escuchar cambios en los turnos desde Supabase
  useEffect(() => {
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
          
          // Refrescar los turnos cuando haya cambios
          fetchShiftsForMonth();
        }
      )
      .subscribe();
      
    // Cargar turnos iniciales
    fetchShiftsForMonth();
    
    // Limpiar suscripción al desmontar
    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentDate]);

  // Función para obtener turnos del mes actual
  const fetchShiftsForMonth = async () => {
    try {
      const month = currentDate.getMonth() + 1;
      const year = currentDate.getFullYear();
      const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
      const lastDay = new Date(year, month, 0).getDate();
      const endDate = `${year}-${month.toString().padStart(2, '0')}-${lastDay}`;
      
      const { data, error } = await supabase
        .from('calendar_shifts')
        .select('*')
        .gte('date', startDate)
        .lte('date', endDate);
        
      if (error) throw error;
      
      if (data) {
        const mappedShifts: CalendarShift[] = data.map(shift => ({
          id: shift.id,
          userId: shift.user_id,
          date: new Date(shift.date),
          type: shift.type as ShiftType,
          startTime: shift.start_time,
          endTime: shift.end_time,
          color: getShiftColor(shift.type as ShiftType),
          hours: shift.hours || 0,
          notes: shift.notes,
          isException: shift.is_exception,
          exceptionReason: shift.exception_reason
        }));
        
        setLocalShifts(mappedShifts);
      }
    } catch (error) {
      console.error("Error fetching shifts:", error);
      toast.error("Error al cargar los turnos");
      // Si falla, mantenemos los turnos actuales
    }
  };

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
        userId: "current-user", // Esto se actualizará con el ID real
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
    if (editedShift) {
      setIsSaving(true);
      
      try {
        // Preparar datos para Supabase
        const shiftData = {
          user_id: editedShift.userId,
          date: format(editedShift.date, 'yyyy-MM-dd'),
          type: editedShift.type,
          start_time: editedShift.startTime,
          end_time: editedShift.endTime,
          hours: parseFloat(editedShift.hours?.toString() || "0"),
          notes: editedShift.notes,
          is_exception: editedShift.isException || false,
          exception_reason: editedShift.exceptionReason
        };
        
        let result;
        
        if (editedShift.id.startsWith('temp-')) {
          // Es un nuevo turno, hacemos insert
          const { data, error } = await supabase
            .from('calendar_shifts')
            .insert(shiftData)
            .select();
            
          if (error) throw error;
          result = data?.[0];
        } else {
          // Es un turno existente, hacemos update
          const { data, error } = await supabase
            .from('calendar_shifts')
            .update(shiftData)
            .eq('id', editedShift.id)
            .select();
            
          if (error) throw error;
          result = data?.[0];
        }
        
        // Si hay una función onShiftEdit proporcionada, la llamamos
        if (onShiftEdit) {
          await onShiftEdit({
            ...editedShift,
            id: result?.id || editedShift.id
          });
        }
        
        // Actualizar el estado local después de guardar
        if (result) {
          const updatedShifts = localShifts.filter(s => s.id !== editedShift.id);
          const savedShift: CalendarShift = {
            id: result.id,
            userId: result.user_id,
            date: new Date(result.date),
            type: result.type as ShiftType,
            startTime: result.start_time,
            endTime: result.end_time,
            color: getShiftColor(result.type as ShiftType),
            hours: result.hours || 0,
            notes: result.notes,
            isException: result.is_exception,
            exceptionReason: result.exception_reason
          };
          
          setLocalShifts([...updatedShifts, savedShift]);
          setSelectedShift(savedShift);
        }
        
        toast.success("Turno guardado correctamente");
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
                      ${`bg-${shift.color}-100 text-${shift.color}-800`}
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
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center">
              <div>
                {isEditMode 
                  ? "Editar turno" 
                  : `Turno: ${selectedShift ? format(selectedShift.date, 'PPP', { locale: es }) : ""}`
                }
              </div>
              {!isEditMode && selectedShift && (
                <Button variant="ghost" size="icon" onClick={handleEditClick}>
                  <Pen className="h-4 w-4" />
                </Button>
              )}
            </DialogTitle>
          </DialogHeader>

          {selectedShift && !isEditMode && (
            <div className="space-y-4">
              <div className="flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-muted-foreground" />
                <span>{format(selectedShift.date, 'EEEE, d MMMM yyyy', { locale: es })}</span>
              </div>
              
              <div className="flex items-center">
                <Briefcase className="mr-2 h-5 w-5 text-muted-foreground" />
                <Badge className={`bg-${selectedShift.color}-100 text-${selectedShift.color}-800 hover:bg-${selectedShift.color}-200`}>
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
                  <Clock className="mr-2 h-5 w-5 text-muted-foreground" />
                  <span>{selectedShift.startTime} - {selectedShift.endTime}</span>
                </div>
              )}
              
              {selectedShift.hours !== undefined && selectedShift.hours > 0 && (
                <div className="flex items-center">
                  <Clock className="mr-2 h-5 w-5 text-muted-foreground" />
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
                    <SelectTrigger>
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
                <Button variant="outline" onClick={handleCancelClick} disabled={isSaving}>
                  Cancelar
                </Button>
                <Button onClick={handleSaveClick} disabled={isSaving}>
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
