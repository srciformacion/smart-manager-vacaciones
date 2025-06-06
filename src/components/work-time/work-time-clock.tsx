
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Clock, Play, Square, Coffee, Utensils, AlertTriangle, Ambulance, Edit, UserX } from 'lucide-react';
import { useWorkTimeRecords } from '@/hooks/work-time/use-work-time-records';
import { useWorkTimeConfig } from '@/hooks/work-time/use-work-time-config';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export function WorkTimeClock() {
  const {
    todayRecord,
    loading,
    clockIn,
    clockOut,
    startBreak,
    endBreak,
    startLunch,
    endLunch,
    startPermission,
    endPermission,
    changeAmbulance
  } = useWorkTimeRecords();

  const { config } = useWorkTimeConfig();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedAmbulance, setSelectedAmbulance] = useState('');
  const [showAmbulanceChange, setShowAmbulanceChange] = useState(false);
  const [newAmbulance, setNewAmbulance] = useState('');

  // Lista de ambulancias disponibles
  const ambulances = [
    'AMB-001',
    'AMB-002', 
    'AMB-003',
    'AMB-004',
    'AMB-005',
    'SVA-001',
    'SVA-002',
    'UVI-001',
    'UVI-002'
  ];

  // Update current time every second
  useState(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  });

  const formatTime = (timeString: string | null) => {
    if (!timeString) return '--:--';
    return format(new Date(timeString), 'HH:mm', { locale: es });
  };

  const getWorkingTime = () => {
    if (!todayRecord?.clock_in_time) return '00:00';
    
    const start = new Date(todayRecord.clock_in_time);
    const end = todayRecord.clock_out_time ? new Date(todayRecord.clock_out_time) : new Date();
    
    let duration = end.getTime() - start.getTime();
    
    // Subtract break time
    if (todayRecord.break_start_time && todayRecord.break_end_time) {
      const breakStart = new Date(todayRecord.break_start_time);
      const breakEnd = new Date(todayRecord.break_end_time);
      duration -= (breakEnd.getTime() - breakStart.getTime());
    }
    
    // Subtract lunch time
    if (todayRecord.lunch_start_time && todayRecord.lunch_end_time) {
      const lunchStart = new Date(todayRecord.lunch_start_time);
      const lunchEnd = new Date(todayRecord.lunch_end_time);
      duration -= (lunchEnd.getTime() - lunchStart.getTime());
    }

    // Subtract permission time
    if (todayRecord.permission_start_time && todayRecord.permission_end_time) {
      const permissionStart = new Date(todayRecord.permission_start_time);
      const permissionEnd = new Date(todayRecord.permission_end_time);
      duration -= (permissionEnd.getTime() - permissionStart.getTime());
    }
    
    const hours = Math.floor(duration / (1000 * 60 * 60));
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const getWorkedHours = () => {
    if (!todayRecord?.clock_in_time) return 0;
    
    const start = new Date(todayRecord.clock_in_time);
    const end = todayRecord.clock_out_time ? new Date(todayRecord.clock_out_time) : new Date();
    
    let duration = end.getTime() - start.getTime();
    
    // Subtract break time
    if (todayRecord.break_start_time && todayRecord.break_end_time) {
      const breakStart = new Date(todayRecord.break_start_time);
      const breakEnd = new Date(todayRecord.break_end_time);
      duration -= (breakEnd.getTime() - breakStart.getTime());
    }
    
    // Subtract lunch time
    if (todayRecord.lunch_start_time && todayRecord.lunch_end_time) {
      const lunchStart = new Date(todayRecord.lunch_start_time);
      const lunchEnd = new Date(todayRecord.lunch_end_time);
      duration -= (lunchEnd.getTime() - lunchStart.getTime());
    }

    // Subtract permission time
    if (todayRecord.permission_start_time && todayRecord.permission_end_time) {
      const permissionStart = new Date(todayRecord.permission_start_time);
      const permissionEnd = new Date(todayRecord.permission_end_time);
      duration -= (permissionEnd.getTime() - permissionStart.getTime());
    }
    
    return duration / (1000 * 60 * 60); // Convert to hours
  };

  const workedHours = getWorkedHours();
  const referenceHours = config?.daily_hours_limit || 8;
  const isOvertime = workedHours > referenceHours;

  const isOnBreak = todayRecord?.break_start_time && !todayRecord?.break_end_time;
  const isOnLunch = todayRecord?.lunch_start_time && !todayRecord?.lunch_end_time;
  const isOnPermission = todayRecord?.permission_start_time && !todayRecord?.permission_end_time;
  const hasClockedIn = !!todayRecord?.clock_in_time;
  const hasClockedOut = !!todayRecord?.clock_out_time;

  const handleClockIn = () => {
    if (selectedAmbulance) {
      clockIn(selectedAmbulance);
    }
  };

  const handleAmbulanceChange = () => {
    if (newAmbulance && todayRecord) {
      changeAmbulance(newAmbulance);
      setShowAmbulanceChange(false);
      setNewAmbulance('');
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Registro de Jornada
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">Cargando...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Registro de Jornada
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current time */}
        <div className="text-center">
          <div className="text-3xl font-bold text-primary">
            {format(currentTime, 'HH:mm:ss')}
          </div>
          <div className="text-sm text-muted-foreground">
            {format(currentTime, 'EEEE, d MMMM yyyy', { locale: es })}
          </div>
        </div>

        {/* Status */}
        <div className="flex justify-center">
          {!hasClockedIn && (
            <Badge variant="outline">Sin fichar</Badge>
          )}
          {hasClockedIn && !hasClockedOut && !isOnBreak && !isOnLunch && !isOnPermission && (
            <Badge variant="default">Trabajando</Badge>
          )}
          {isOnBreak && (
            <Badge variant="secondary">En descanso</Badge>
          )}
          {isOnLunch && (
            <Badge variant="secondary">En almuerzo</Badge>
          )}
          {isOnPermission && (
            <Badge variant="secondary">En permiso</Badge>
          )}
          {hasClockedOut && (
            <Badge variant="outline">Jornada finalizada</Badge>
          )}
        </div>

        {/* Ambulance info with change option */}
        {todayRecord?.notes && (
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2 text-sm">
              <Ambulance className="h-4 w-4" />
              <span className="font-medium">Ambulancia: {todayRecord.notes}</span>
              {hasClockedIn && !hasClockedOut && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAmbulanceChange(!showAmbulanceChange)}
                  className="h-6 w-6 p-0"
                >
                  <Edit className="h-3 w-3" />
                </Button>
              )}
            </div>

            {/* Change ambulance form */}
            {showAmbulanceChange && (
              <div className="space-y-2 p-3 border rounded-lg bg-muted/50">
                <Label htmlFor="new-ambulance">Cambiar ambulancia</Label>
                <Select value={newAmbulance} onValueChange={setNewAmbulance}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona nueva ambulancia..." />
                  </SelectTrigger>
                  <SelectContent>
                    {ambulances.map((ambulance) => (
                      <SelectItem key={ambulance} value={ambulance}>
                        {ambulance}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex gap-2">
                  <Button 
                    onClick={handleAmbulanceChange} 
                    size="sm" 
                    disabled={!newAmbulance}
                  >
                    Cambiar
                  </Button>
                  <Button 
                    onClick={() => {
                      setShowAmbulanceChange(false);
                      setNewAmbulance('');
                    }} 
                    variant="outline" 
                    size="sm"
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Working time */}
        <div className="text-center">
          <div className="text-xl font-semibold flex items-center justify-center gap-2">
            Tiempo trabajado: {getWorkingTime()}
            {isOvertime && hasClockedIn && (
              <AlertTriangle className="h-5 w-5 text-amber-500" />
            )}
          </div>
          {isOvertime && hasClockedIn && (
            <div className="text-sm text-amber-600 mt-1">
              Has superado la jornada de referencia ({referenceHours}h)
            </div>
          )}
        </div>

        {/* Time records */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="font-medium">Entrada</div>
            <div>{formatTime(todayRecord?.clock_in_time)}</div>
          </div>
          <div>
            <div className="font-medium">Salida</div>
            <div>{formatTime(todayRecord?.clock_out_time)}</div>
          </div>
          <div>
            <div className="font-medium">Descanso</div>
            <div>
              {formatTime(todayRecord?.break_start_time)} - {formatTime(todayRecord?.break_end_time)}
            </div>
          </div>
          <div>
            <div className="font-medium">Almuerzo</div>
            <div>
              {formatTime(todayRecord?.lunch_start_time)} - {formatTime(todayRecord?.lunch_end_time)}
            </div>
          </div>
          <div className="col-span-2">
            <div className="font-medium">Permiso</div>
            <div>
              {formatTime(todayRecord?.permission_start_time)} - {formatTime(todayRecord?.permission_end_time)}
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="space-y-2">
          {!hasClockedIn && (
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="ambulance-select">Selecciona tu ambulancia</Label>
                <Select value={selectedAmbulance} onValueChange={setSelectedAmbulance}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una ambulancia..." />
                  </SelectTrigger>
                  <SelectContent>
                    {ambulances.map((ambulance) => (
                      <SelectItem key={ambulance} value={ambulance}>
                        {ambulance}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                onClick={handleClockIn} 
                className="w-full" 
                size="lg"
                disabled={!selectedAmbulance}
              >
                <Play className="h-4 w-4 mr-2" />
                Fichar Entrada
              </Button>
            </div>
          )}

          {hasClockedIn && !hasClockedOut && (
            <>
              <div className="grid grid-cols-3 gap-2">
                {!isOnBreak ? (
                  <Button 
                    onClick={startBreak} 
                    variant="outline"
                    disabled={isOnLunch || isOnPermission}
                  >
                    <Coffee className="h-4 w-4 mr-2" />
                    Descanso
                  </Button>
                ) : (
                  <Button onClick={endBreak} variant="outline">
                    <Square className="h-4 w-4 mr-2" />
                    Fin Descanso
                  </Button>
                )}

                {!isOnLunch ? (
                  <Button 
                    onClick={startLunch} 
                    variant="outline"
                    disabled={isOnBreak || isOnPermission}
                  >
                    <Utensils className="h-4 w-4 mr-2" />
                    Almuerzo
                  </Button>
                ) : (
                  <Button onClick={endLunch} variant="outline">
                    <Square className="h-4 w-4 mr-2" />
                    Fin Almuerzo
                  </Button>
                )}

                {!isOnPermission ? (
                  <Button 
                    onClick={startPermission} 
                    variant="outline"
                    disabled={isOnBreak || isOnLunch}
                  >
                    <UserX className="h-4 w-4 mr-2" />
                    Permiso
                  </Button>
                ) : (
                  <Button onClick={endPermission} variant="outline">
                    <Square className="h-4 w-4 mr-2" />
                    Fin Permiso
                  </Button>
                )}
              </div>

              <Button 
                onClick={clockOut} 
                className="w-full" 
                size="lg"
                disabled={isOnBreak || isOnLunch || isOnPermission}
              >
                <Square className="h-4 w-4 mr-2" />
                Fichar Salida
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
