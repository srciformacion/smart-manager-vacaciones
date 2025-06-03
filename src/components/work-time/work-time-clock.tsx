
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Play, Square, Coffee, Utensils } from 'lucide-react';
import { useWorkTimeRecords } from '@/hooks/work-time/use-work-time-records';
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
    endLunch
  } = useWorkTimeRecords();

  const [currentTime, setCurrentTime] = useState(new Date());

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
    
    const hours = Math.floor(duration / (1000 * 60 * 60));
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const isOnBreak = todayRecord?.break_start_time && !todayRecord?.break_end_time;
  const isOnLunch = todayRecord?.lunch_start_time && !todayRecord?.lunch_end_time;
  const hasClockedIn = !!todayRecord?.clock_in_time;
  const hasClockedOut = !!todayRecord?.clock_out_time;

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
          {hasClockedIn && !hasClockedOut && !isOnBreak && !isOnLunch && (
            <Badge variant="default">Trabajando</Badge>
          )}
          {isOnBreak && (
            <Badge variant="secondary">En descanso</Badge>
          )}
          {isOnLunch && (
            <Badge variant="secondary">En almuerzo</Badge>
          )}
          {hasClockedOut && (
            <Badge variant="outline">Jornada finalizada</Badge>
          )}
        </div>

        {/* Working time */}
        <div className="text-center">
          <div className="text-xl font-semibold">
            Tiempo trabajado: {getWorkingTime()}
          </div>
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
        </div>

        {/* Action buttons */}
        <div className="space-y-2">
          {!hasClockedIn && (
            <Button onClick={clockIn} className="w-full" size="lg">
              <Play className="h-4 w-4 mr-2" />
              Fichar Entrada
            </Button>
          )}

          {hasClockedIn && !hasClockedOut && (
            <>
              <div className="grid grid-cols-2 gap-2">
                {!isOnBreak ? (
                  <Button 
                    onClick={startBreak} 
                    variant="outline"
                    disabled={isOnLunch}
                  >
                    <Coffee className="h-4 w-4 mr-2" />
                    Iniciar Descanso
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
                    disabled={isOnBreak}
                  >
                    <Utensils className="h-4 w-4 mr-2" />
                    Iniciar Almuerzo
                  </Button>
                ) : (
                  <Button onClick={endLunch} variant="outline">
                    <Square className="h-4 w-4 mr-2" />
                    Fin Almuerzo
                  </Button>
                )}
              </div>

              <Button 
                onClick={clockOut} 
                className="w-full" 
                size="lg"
                disabled={isOnBreak || isOnLunch}
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
