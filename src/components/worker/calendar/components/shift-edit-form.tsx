
import React from 'react';
import { CalendarShift, ShiftType } from '@/types/calendar';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ShiftEditFormProps {
  shift: CalendarShift;
  isLoading: boolean;
  onShiftChange: (updatedShift: CalendarShift) => void;
  onSave: () => void;
  onCancel: () => void;
}

export function ShiftEditForm({ shift, isLoading, onShiftChange, onSave, onCancel }: ShiftEditFormProps) {
  const handleTypeChange = (value: ShiftType) => {
    onShiftChange({
      ...shift, 
      type: value, 
      color: getShiftColor(value)
    });
  };

  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onShiftChange({
      ...shift, 
      hours: parseFloat(e.target.value) || 0
    });
  };

  const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onShiftChange({
      ...shift, 
      startTime: e.target.value
    });
  };

  const handleEndTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onShiftChange({
      ...shift, 
      endTime: e.target.value
    });
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onShiftChange({
      ...shift, 
      notes: e.target.value
    });
  };

  return (
    <div className="space-y-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="type">Tipo de turno</Label>
          <Select 
            value={shift.type} 
            onValueChange={handleTypeChange}
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
            value={shift.hours || 0}
            onChange={handleHoursChange}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="startTime">Hora inicio</Label>
          <Input 
            id="startTime"
            type="time"
            value={shift.startTime || ""}
            onChange={handleStartTimeChange}
          />
        </div>
        <div>
          <Label htmlFor="endTime">Hora fin</Label>
          <Input 
            id="endTime"
            type="time"
            value={shift.endTime || ""}
            onChange={handleEndTimeChange}
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="notes">Notas</Label>
        <Textarea 
          id="notes"
          value={shift.notes || ""}
          onChange={handleNotesChange}
          placeholder="Añadir notas sobre el turno..."
        />
      </div>
      
      <div className="flex justify-between mt-4">
        <Button 
          variant="outline" 
          onClick={onCancel} 
          disabled={isLoading}
          aria-label="Cancelar edición"
        >
          Cancelar
        </Button>
        <Button 
          onClick={onSave} 
          disabled={isLoading}
          aria-label="Guardar cambios del turno"
        >
          {isLoading ? "Guardando..." : "Guardar"}
        </Button>
      </div>
    </div>
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
