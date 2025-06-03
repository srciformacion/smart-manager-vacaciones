
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Save, AlertTriangle, MapPin, Shield } from 'lucide-react';
import { useWorkTimeConfig } from '@/hooks/work-time/use-work-time-config';
import { useToast } from '@/components/ui/use-toast';
import { WorkTimeLocationsManager } from './work-time-locations-manager';

export function WorkTimeSettings() {
  const { config, loading, updateConfig } = useWorkTimeConfig();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    is_enabled: false,
    daily_hours_limit: 8,
    weekly_hours_limit: 40,
    alert_incomplete_workday: true,
    alert_missing_records: true,
    alert_overtime: true,
    location_restriction_enabled: false,
    ip_restriction_enabled: false,
    require_location_permission: true
  });

  // Update form data when config loads
  useState(() => {
    if (config) {
      setFormData({
        is_enabled: config.is_enabled,
        daily_hours_limit: config.daily_hours_limit,
        weekly_hours_limit: config.weekly_hours_limit,
        alert_incomplete_workday: config.alert_incomplete_workday,
        alert_missing_records: config.alert_missing_records,
        alert_overtime: config.alert_overtime,
        location_restriction_enabled: config.location_restriction_enabled || false,
        ip_restriction_enabled: config.ip_restriction_enabled || false,
        require_location_permission: config.require_location_permission !== false
      });
    }
  });

  const handleSave = async () => {
    await updateConfig(formData);
  };

  const handleToggleModule = async () => {
    const newEnabledState = !formData.is_enabled;
    setFormData(prev => ({ ...prev, is_enabled: newEnabledState }));
    
    await updateConfig({ is_enabled: newEnabledState });
    
    toast({
      title: newEnabledState ? "Módulo activado" : "Módulo desactivado",
      description: newEnabledState 
        ? "El módulo de jornada laboral está ahora activo"
        : "El módulo de jornada laboral está ahora inactivo"
    });
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configuración de Jornada Laboral
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">Cargando configuración...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configuración de Jornada Laboral
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Module Toggle */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <div className="font-medium">Activar Módulo de Jornada Laboral</div>
              <div className="text-sm text-muted-foreground">
                Habilita el registro de entrada y salida para los trabajadores
              </div>
            </div>
            <Switch
              checked={formData.is_enabled}
              onCheckedChange={handleToggleModule}
            />
          </div>

          {formData.is_enabled && (
            <Tabs defaultValue="general" className="space-y-4">
              <TabsList>
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="security">Seguridad</TabsTrigger>
                <TabsTrigger value="locations">Ubicaciones</TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="space-y-6">
                <Separator />

                {/* Working Hours Configuration */}
                <div className="space-y-4">
                  <h3 className="font-medium">Configuración de Horarios</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="daily_hours">Jornada laboral de referencia (horas)</Label>
                      <Input
                        id="daily_hours"
                        type="number"
                        min="1"
                        max="24"
                        step="0.5"
                        value={formData.daily_hours_limit}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          daily_hours_limit: parseFloat(e.target.value) || 8
                        }))}
                      />
                      <div className="text-xs text-muted-foreground">
                        Referencia para alertas de exceso de jornada (sin límite estricto)
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="weekly_hours">Límite de horas semanales</Label>
                      <Input
                        id="weekly_hours"
                        type="number"
                        min="1"
                        max="168"
                        value={formData.weekly_hours_limit}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          weekly_hours_limit: parseInt(e.target.value) || 40
                        }))}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Alerts Configuration */}
                <div className="space-y-4">
                  <h3 className="font-medium flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Configuración de Alertas
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Alertar jornadas incompletas</div>
                        <div className="text-sm text-muted-foreground">
                          Notifica cuando un trabajador no completa su jornada mínima
                        </div>
                      </div>
                      <Switch
                        checked={formData.alert_incomplete_workday}
                        onCheckedChange={(checked) => setFormData(prev => ({
                          ...prev,
                          alert_incomplete_workday: checked
                        }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Alertar registros faltantes</div>
                        <div className="text-sm text-muted-foreground">
                          Notifica cuando un trabajador no registra su jornada
                        </div>
                      </div>
                      <Switch
                        checked={formData.alert_missing_records}
                        onCheckedChange={(checked) => setFormData(prev => ({
                          ...prev,
                          alert_missing_records: checked
                        }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Alertar exceso de jornada</div>
                        <div className="text-sm text-muted-foreground">
                          Notifica cuando se supera la jornada laboral de referencia (sin bloquear)
                        </div>
                      </div>
                      <Switch
                        checked={formData.alert_overtime}
                        onCheckedChange={(checked) => setFormData(prev => ({
                          ...prev,
                          alert_overtime: checked
                        }))}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <Button onClick={handleSave} className="w-full">
                  <Save className="h-4 w-4 mr-2" />
                  Guardar Configuración General
                </Button>
              </TabsContent>

              <TabsContent value="security" className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-medium flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Restricciones de Seguridad
                  </h3>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Restricción por ubicación</div>
                        <div className="text-sm text-muted-foreground">
                          Los trabajadores solo pueden fichar desde ubicaciones autorizadas
                        </div>
                      </div>
                      <Switch
                        checked={formData.location_restriction_enabled}
                        onCheckedChange={(checked) => setFormData(prev => ({
                          ...prev,
                          location_restriction_enabled: checked
                        }))}
                      />
                    </div>

                    {formData.location_restriction_enabled && (
                      <div className="flex items-center justify-between pl-4">
                        <div>
                          <div className="font-medium">Solicitar permisos de ubicación</div>
                          <div className="text-sm text-muted-foreground">
                            Requiere que los usuarios otorguen permisos de geolocalización
                          </div>
                        </div>
                        <Switch
                          checked={formData.require_location_permission}
                          onCheckedChange={(checked) => setFormData(prev => ({
                            ...prev,
                            require_location_permission: checked
                          }))}
                        />
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Restricción por IP</div>
                        <div className="text-sm text-muted-foreground">
                          Los trabajadores solo pueden fichar desde direcciones IP autorizadas
                        </div>
                      </div>
                      <Switch
                        checked={formData.ip_restriction_enabled}
                        onCheckedChange={(checked) => setFormData(prev => ({
                          ...prev,
                          ip_restriction_enabled: checked
                        }))}
                      />
                    </div>
                  </div>

                  {(formData.location_restriction_enabled || formData.ip_restriction_enabled) && (
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5" />
                        <div className="text-sm">
                          <div className="font-medium text-amber-800">Importante</div>
                          <div className="text-amber-700">
                            Las restricciones de seguridad pueden afectar la capacidad de los trabajadores 
                            para fichar. Asegúrate de configurar correctamente las ubicaciones e IPs permitidas.
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <Separator />

                <Button onClick={handleSave} className="w-full">
                  <Save className="h-4 w-4 mr-2" />
                  Guardar Configuración de Seguridad
                </Button>
              </TabsContent>

              <TabsContent value="locations">
                <WorkTimeLocationsManager />
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
