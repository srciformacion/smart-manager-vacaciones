
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { MapPin, Plus, Edit, Trash2, Navigation } from 'lucide-react';
import { useWorkTimeLocations, WorkTimeLocation } from '@/hooks/work-time/use-work-time-locations';
import { useLocationVerification } from '@/hooks/work-time/use-location-verification';
import { useToast } from '@/components/ui/use-toast';

export function WorkTimeLocationsManager() {
  const { locations, loading, createLocation, updateLocation, deleteLocation } = useWorkTimeLocations();
  const { getUserLocation } = useLocationVerification();
  const { toast } = useToast();
  
  const [editingLocation, setEditingLocation] = useState<WorkTimeLocation | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    latitude: '',
    longitude: '',
    radius_meters: 100,
    allowed_ip_addresses: '',
    is_active: true
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      latitude: '',
      longitude: '',
      radius_meters: 100,
      allowed_ip_addresses: '',
      is_active: true
    });
    setEditingLocation(null);
  };

  const handleEdit = (location: WorkTimeLocation) => {
    setEditingLocation(location);
    setFormData({
      name: location.name,
      description: location.description || '',
      latitude: location.latitude?.toString() || '',
      longitude: location.longitude?.toString() || '',
      radius_meters: location.radius_meters,
      allowed_ip_addresses: location.allowed_ip_addresses?.join(', ') || '',
      is_active: location.is_active
    });
    setIsCreateDialogOpen(true);
  };

  const handleGetCurrentLocation = async () => {
    try {
      const location = await getUserLocation();
      setFormData(prev => ({
        ...prev,
        latitude: location.latitude.toString(),
        longitude: location.longitude.toString()
      }));
      toast({
        title: "Ubicación obtenida",
        description: "Se ha obtenido tu ubicación actual"
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo obtener la ubicación"
      });
    }
  };

  const handleSubmit = async () => {
    try {
      const locationData = {
        name: formData.name,
        description: formData.description || null,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null,
        radius_meters: formData.radius_meters,
        allowed_ip_addresses: formData.allowed_ip_addresses 
          ? formData.allowed_ip_addresses.split(',').map(ip => ip.trim()).filter(ip => ip)
          : null,
        is_active: formData.is_active
      };

      if (editingLocation) {
        await updateLocation(editingLocation.id, locationData);
      } else {
        await createLocation(locationData);
      }

      setIsCreateDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving location:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta ubicación?')) {
      await deleteLocation(id);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Ubicaciones Permitidas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">Cargando ubicaciones...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Ubicaciones Permitidas
        </CardTitle>
        <div className="flex justify-end">
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Nueva Ubicación
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingLocation ? 'Editar Ubicación' : 'Nueva Ubicación'}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ej: Oficina Central"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Descripción opcional de la ubicación"
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label htmlFor="latitude">Latitud</Label>
                    <Input
                      id="latitude"
                      type="number"
                      step="any"
                      value={formData.latitude}
                      onChange={(e) => setFormData(prev => ({ ...prev, latitude: e.target.value }))}
                      placeholder="40.4168"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="longitude">Longitud</Label>
                    <Input
                      id="longitude"
                      type="number"
                      step="any"
                      value={formData.longitude}
                      onChange={(e) => setFormData(prev => ({ ...prev, longitude: e.target.value }))}
                      placeholder="-3.7038"
                    />
                  </div>
                </div>

                <Button 
                  onClick={handleGetCurrentLocation} 
                  variant="outline" 
                  className="w-full"
                  type="button"
                >
                  <Navigation className="h-4 w-4 mr-2" />
                  Usar mi ubicación actual
                </Button>

                <div className="space-y-2">
                  <Label htmlFor="radius">Radio permitido (metros)</Label>
                  <Input
                    id="radius"
                    type="number"
                    min="1"
                    value={formData.radius_meters}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      radius_meters: parseInt(e.target.value) || 100 
                    }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ips">IPs permitidas (separadas por comas)</Label>
                  <Textarea
                    id="ips"
                    value={formData.allowed_ip_addresses}
                    onChange={(e) => setFormData(prev => ({ ...prev, allowed_ip_addresses: e.target.value }))}
                    placeholder="192.168.1.100, 10.0.0.50"
                    rows={2}
                  />
                  <div className="text-xs text-muted-foreground">
                    Opcional. Si se especifica, solo estas IPs pueden fichar desde esta ubicación
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="active">Ubicación activa</Label>
                  <Switch
                    id="active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button onClick={handleSubmit} className="flex-1">
                    {editingLocation ? 'Actualizar' : 'Crear'}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setIsCreateDialogOpen(false);
                      resetForm();
                    }}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {locations.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No hay ubicaciones configuradas</p>
            <p className="text-sm">Crea una nueva ubicación para empezar</p>
          </div>
        ) : (
          <div className="space-y-4">
            {locations.map((location) => (
              <div key={location.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium">{location.name}</h4>
                      <Badge variant={location.is_active ? "default" : "secondary"}>
                        {location.is_active ? "Activa" : "Inactiva"}
                      </Badge>
                    </div>
                    
                    {location.description && (
                      <p className="text-sm text-muted-foreground mb-2">
                        {location.description}
                      </p>
                    )}
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="font-medium">Coordenadas</div>
                        <div>
                          {location.latitude && location.longitude 
                            ? `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`
                            : 'No especificadas'
                          }
                        </div>
                      </div>
                      <div>
                        <div className="font-medium">Radio</div>
                        <div>{location.radius_meters}m</div>
                      </div>
                    </div>
                    
                    {location.allowed_ip_addresses && location.allowed_ip_addresses.length > 0 && (
                      <div className="mt-2">
                        <div className="font-medium text-sm">IPs permitidas:</div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {location.allowed_ip_addresses.map((ip, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {ip}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(location)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(location.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
