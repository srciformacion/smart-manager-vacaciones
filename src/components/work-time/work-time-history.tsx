
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useWorkTimeRecords } from '@/hooks/work-time/use-work-time-records';
import { format, subDays, subWeeks, subMonths } from 'date-fns';
import { es } from 'date-fns/locale';

export function WorkTimeHistory() {
  const [dateRange, setDateRange] = useState('week');
  const { records, loading, fetchRecords } = useWorkTimeRecords();

  const handleDateRangeChange = (range: string) => {
    setDateRange(range);
    const today = new Date();
    let startDate: string;

    switch (range) {
      case 'day':
        startDate = today.toISOString().split('T')[0];
        fetchRecords(startDate, startDate);
        break;
      case 'week':
        startDate = subWeeks(today, 1).toISOString().split('T')[0];
        fetchRecords(startDate);
        break;
      case 'month':
        startDate = subMonths(today, 1).toISOString().split('T')[0];
        fetchRecords(startDate);
        break;
      default:
        fetchRecords();
    }
  };

  const formatTime = (timeString: string | null) => {
    if (!timeString) return '--:--';
    return format(new Date(timeString), 'HH:mm', { locale: es });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'complete':
        return <Badge variant="default">Completa</Badge>;
      case 'partial':
        return <Badge variant="secondary">Parcial</Badge>;
      case 'incomplete':
        return <Badge variant="destructive">Incompleta</Badge>;
      default:
        return <Badge variant="outline">Desconocido</Badge>;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Historial de Jornadas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">Cargando historial...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Historial de Jornadas
        </CardTitle>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <Select value={dateRange} onValueChange={handleDateRangeChange}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Hoy</SelectItem>
              <SelectItem value="week">Última semana</SelectItem>
              <SelectItem value="month">Último mes</SelectItem>
              <SelectItem value="all">Todo el historial</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {records.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No hay registros de jornada para el período seleccionado
          </div>
        ) : (
          <div className="space-y-4">
            {records.map((record) => (
              <div key={record.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium">
                    {format(new Date(record.date), 'EEEE, d MMMM yyyy', { locale: es })}
                  </div>
                  {getStatusBadge(record.status)}
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">Entrada</div>
                    <div className="font-medium">{formatTime(record.clock_in_time)}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Salida</div>
                    <div className="font-medium">{formatTime(record.clock_out_time)}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Horas trabajadas</div>
                    <div className="font-medium">
                      {record.total_worked_hours ? `${record.total_worked_hours.toFixed(2)}h` : '--'}
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Estado</div>
                    <div className="font-medium capitalize">{record.status}</div>
                  </div>
                </div>

                {(record.break_start_time || record.lunch_start_time || record.permission_start_time) && (
                  <div className="mt-3 pt-3 border-t">
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      {record.break_start_time && (
                        <div>
                          <div className="text-muted-foreground">Descanso</div>
                          <div>
                            {formatTime(record.break_start_time)} - {formatTime(record.break_end_time)}
                          </div>
                        </div>
                      )}
                      {record.lunch_start_time && (
                        <div>
                          <div className="text-muted-foreground">Almuerzo</div>
                          <div>
                            {formatTime(record.lunch_start_time)} - {formatTime(record.lunch_end_time)}
                          </div>
                        </div>
                      )}
                      {record.permission_start_time && (
                        <div>
                          <div className="text-muted-foreground">Permiso</div>
                          <div>
                            {formatTime(record.permission_start_time)} - {formatTime(record.permission_end_time)}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {record.notes && (
                  <div className="mt-3 pt-3 border-t">
                    <div className="text-sm">
                      <div className="text-muted-foreground">Ambulancia</div>
                      <div>{record.notes}</div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
