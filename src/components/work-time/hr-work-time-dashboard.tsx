
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, Clock, Users, Filter, Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useToast } from '@/components/ui/use-toast';

interface WorkTimeAlert {
  id: string;
  user_id: string;
  alert_type: string;
  alert_date: string;
  message: string;
  is_resolved: boolean;
  created_at: string;
}

interface WorkTimeRecordWithUser {
  id: string;
  user_id: string;
  date: string;
  clock_in_time: string | null;
  clock_out_time: string | null;
  total_worked_hours: number | null;
  status: string;
  user_name?: string;
  user_email?: string;
}

export function HRWorkTimeDashboard() {
  const [alerts, setAlerts] = useState<WorkTimeAlert[]>([]);
  const [records, setRecords] = useState<WorkTimeRecordWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('today');
  const { toast } = useToast();

  const fetchAlerts = async () => {
    try {
      const { data, error } = await supabase
        .from('work_time_alerts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAlerts(data || []);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    }
  };

  const fetchRecords = async () => {
    try {
      let query = supabase
        .from('work_time_records')
        .select(`
          *,
          profiles!inner(name, email)
        `)
        .order('date', { ascending: false });

      if (dateFilter === 'today') {
        const today = new Date().toISOString().split('T')[0];
        query = query.eq('date', today);
      } else if (dateFilter === 'week') {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        query = query.gte('date', weekAgo.toISOString().split('T')[0]);
      }

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;

      if (error) throw error;

      const recordsWithUserInfo = (data || []).map(record => ({
        ...record,
        user_name: record.profiles?.name || 'Usuario',
        user_email: record.profiles?.email || ''
      }));

      setRecords(recordsWithUserInfo);
    } catch (error) {
      console.error('Error fetching records:', error);
    }
  };

  const resolveAlert = async (alertId: string) => {
    try {
      const { error } = await supabase
        .from('work_time_alerts')
        .update({
          is_resolved: true,
          resolved_at: new Date().toISOString()
        })
        .eq('id', alertId);

      if (error) throw error;

      setAlerts(prev => prev.map(alert => 
        alert.id === alertId 
          ? { ...alert, is_resolved: true }
          : alert
      ));

      toast({
        title: "Alerta resuelta",
        description: "La alerta ha sido marcada como resuelta"
      });
    } catch (error) {
      console.error('Error resolving alert:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo resolver la alerta"
      });
    }
  };

  const getAlertTypeBadge = (type: string) => {
    switch (type) {
      case 'missing_record':
        return <Badge variant="destructive">Sin registro</Badge>;
      case 'incomplete_workday':
        return <Badge variant="secondary">Jornada incompleta</Badge>;
      case 'overtime':
        return <Badge variant="outline">Horas extra</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
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

  const filteredRecords = records.filter(record => {
    const matchesSearch = !searchTerm || 
      record.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.user_email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  const unresolvedAlerts = alerts.filter(alert => !alert.is_resolved);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchAlerts(), fetchRecords()]);
      setLoading(false);
    };

    loadData();
  }, [dateFilter, statusFilter]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">Cargando dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertas Pendientes</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{unresolvedAlerts.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Registros Hoy</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{records.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Jornadas Completas</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {records.filter(r => r.status === 'complete').length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="records" className="space-y-4">
        <TabsList>
          <TabsTrigger value="records">Registros de Jornada</TabsTrigger>
          <TabsTrigger value="alerts">
            Alertas {unresolvedAlerts.length > 0 && `(${unresolvedAlerts.length})`}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="records" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar por nombre o email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">Hoy</SelectItem>
                    <SelectItem value="week">Última semana</SelectItem>
                    <SelectItem value="all">Todo</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los estados</SelectItem>
                    <SelectItem value="complete">Completa</SelectItem>
                    <SelectItem value="partial">Parcial</SelectItem>
                    <SelectItem value="incomplete">Incompleta</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Records List */}
          <Card>
            <CardHeader>
              <CardTitle>Registros de Jornada</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredRecords.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No hay registros que coincidan con los filtros
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredRecords.map((record) => (
                    <div key={record.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <div className="font-medium">{record.user_name}</div>
                          <div className="text-sm text-muted-foreground">{record.user_email}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-muted-foreground">
                            {format(new Date(record.date), 'dd/MM/yyyy', { locale: es })}
                          </div>
                          {getStatusBadge(record.status)}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <div className="text-muted-foreground">Entrada</div>
                          <div className="font-medium">
                            {record.clock_in_time 
                              ? format(new Date(record.clock_in_time), 'HH:mm')
                              : '--:--'
                            }
                          </div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Salida</div>
                          <div className="font-medium">
                            {record.clock_out_time 
                              ? format(new Date(record.clock_out_time), 'HH:mm')
                              : '--:--'
                            }
                          </div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Horas trabajadas</div>
                          <div className="font-medium">
                            {record.total_worked_hours 
                              ? `${record.total_worked_hours.toFixed(2)}h`
                              : '--'
                            }
                          </div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Estado</div>
                          <div className="font-medium capitalize">{record.status}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Alertas del Sistema</CardTitle>
            </CardHeader>
            <CardContent>
              {alerts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No hay alertas en el sistema
                </div>
              ) : (
                <div className="space-y-4">
                  {alerts.map((alert) => (
                    <div 
                      key={alert.id} 
                      className={`border rounded-lg p-4 ${alert.is_resolved ? 'opacity-60' : ''}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {getAlertTypeBadge(alert.alert_type)}
                            {alert.is_resolved && (
                              <Badge variant="outline">Resuelta</Badge>
                            )}
                          </div>
                          <div className="font-medium mb-1">{alert.message}</div>
                          <div className="text-sm text-muted-foreground">
                            Fecha: {format(new Date(alert.alert_date), 'dd/MM/yyyy', { locale: es })}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Creada: {format(new Date(alert.created_at), 'dd/MM/yyyy HH:mm', { locale: es })}
                          </div>
                        </div>
                        {!alert.is_resolved && (
                          <Button
                            onClick={() => resolveAlert(alert.id)}
                            variant="outline"
                            size="sm"
                          >
                            Resolver
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
