
import { useState } from "react";
import { User } from "@/types";
import { CalendarShift, ShiftType } from "@/types/calendar";
import { useCalendarManagement } from "@/hooks/hr/use-calendar-management";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { DatePicker } from "@/components/ui/date-picker";
import { format, startOfMonth, getDay } from "date-fns";
import { es } from "date-fns/locale";
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  Upload, 
  Clock, 
  PlusCircle 
} from "lucide-react";

interface CalendarManagementProps {
  workers: User[];
}

export function CalendarManagement({ workers }: CalendarManagementProps) {
  const [activeTab, setActiveTab] = useState("calendar");
  
  const {
    selectedUser,
    currentDate,
    shifts,
    annualHours,
    loadUserMonthlyShifts,
    nextMonth,
    previousMonth,
    exportToExcel,
    generateHoursReport
  } = useCalendarManagement();

  const handleUserChange = (userId: string) => {
    const user = workers.find(w => w.id === userId);
    if (user) {
      loadUserMonthlyShifts(user);
    }
  };

  const ShiftBadge = ({ type }: { type: ShiftType }) => {
    const getShiftColor = (shiftType: ShiftType) => {
      switch (shiftType) {
        case "morning": return "bg-blue-100 text-blue-800 border-blue-300";
        case "afternoon": return "bg-amber-100 text-amber-800 border-amber-300";
        case "night": return "bg-indigo-100 text-indigo-800 border-indigo-300";
        case "24h": return "bg-red-100 text-red-800 border-red-300";
        case "free": return "bg-green-100 text-green-800 border-green-300";
        case "guard": return "bg-purple-100 text-purple-800 border-purple-300";
        case "unassigned": return "bg-gray-100 text-gray-800 border-gray-300";
        case "training": return "bg-orange-100 text-orange-800 border-orange-300";
        case "special": return "bg-yellow-100 text-yellow-800 border-yellow-300";
        case "oncall": return "bg-teal-100 text-teal-800 border-teal-300";
        case "custom": return "bg-pink-100 text-pink-800 border-pink-300";
        default: return "bg-gray-100 text-gray-800 border-gray-300";
      }
    };

    const getShiftLabel = (shiftType: ShiftType) => {
      switch (shiftType) {
        case "morning": return "Mañana";
        case "afternoon": return "Tarde";
        case "night": return "Noche";
        case "24h": return "24h";
        case "free": return "Libre";
        case "guard": return "Guardia";
        case "unassigned": return "Sin asignar";
        case "training": return "Formación";
        case "special": return "Especial";
        case "oncall": return "Localizado";
        case "custom": return "Personalizado";
        default: return shiftType;
      }
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getShiftColor(type)}`}>
        {getShiftLabel(type)}
      </span>
    );
  };

  // Renderizado personalizado para los días del calendario
  const renderDay = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    const shift = shifts.find(s => s.date.toISOString().split('T')[0] === dateStr);
    
    if (!shift) return null;
    
    return (
      <div className="h-full w-full flex flex-col items-center justify-center">
        <div className="text-sm font-medium">{date.getDate()}</div>
        {shift && <ShiftBadge type={shift.type} />}
        {shift && shift.hours > 0 && (
          <div className="text-xs mt-1 text-muted-foreground">
            {shift.hours}h
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestión de calendarios y turnos</h1>
          <p className="text-muted-foreground mt-2">
            Administre los calendarios laborales y turnos del personal
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Seleccionar trabajador</CardTitle>
          <CardDescription>
            Elija un trabajador para ver y gestionar su calendario
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <Select value={selectedUser?.id || ""} onValueChange={handleUserChange}>
              <SelectTrigger className="w-full md:w-[300px]">
                <SelectValue placeholder="Seleccionar trabajador" />
              </SelectTrigger>
              <SelectContent>
                {workers.map(worker => (
                  <SelectItem key={worker.id} value={worker.id}>
                    {worker.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {selectedUser && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="w-full md:w-auto">
            <TabsTrigger value="calendar">Calendario</TabsTrigger>
            <TabsTrigger value="hours">Horas anuales</TabsTrigger>
            <TabsTrigger value="exports">Importar/Exportar</TabsTrigger>
          </TabsList>
          
          <TabsContent value="calendar" className="space-y-4">
            <Card>
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Calendario de turnos</CardTitle>
                  <CardDescription>
                    {selectedUser.name} - {format(currentDate, 'MMMM yyyy', { locale: es })}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" onClick={previousMonth}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={nextMonth}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="bg-white rounded-md shadow mb-4 p-4 border">
                      <div className="grid grid-cols-7 gap-2 mb-2">
                        {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((day, i) => (
                          <div key={i} className="text-center text-sm font-medium">
                            {day}
                          </div>
                        ))}
                      </div>
                      <div className="grid grid-cols-7 gap-2">
                        {shifts.map((shift, index) => {
                          const date = new Date(shift.date);
                          // Ajustar para mostrar correctamente los días del mes
                          const firstDay = getDay(startOfMonth(date));
                          const dayOfMonth = date.getDate();
                          
                          return (
                            <div 
                              key={shift.id} 
                              className={`
                                aspect-square p-1 text-center rounded-md border cursor-pointer
                                hover:bg-muted transition-colors
                                ${shift.type !== 'unassigned' ? 'border-primary/20' : 'border-gray-200'}
                              `}
                            >
                              <div className="text-sm font-medium">{dayOfMonth}</div>
                              <ShiftBadge type={shift.type} />
                              {shift.hours > 0 && (
                                <div className="text-xs mt-1 text-muted-foreground">
                                  {shift.hours}h
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    
                    <div className="flex gap-2 flex-wrap">
                      <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Añadir turno
                      </Button>
                      <Button variant="outline">
                        Aplicar plantilla
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-2">Leyenda de turnos</h3>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center gap-2">
                          <ShiftBadge type="morning" />
                          <span className="text-sm">Mañana (7:00-15:00)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <ShiftBadge type="afternoon" />
                          <span className="text-sm">Tarde (15:00-23:00)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <ShiftBadge type="night" />
                          <span className="text-sm">Noche (23:00-7:00)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <ShiftBadge type="24h" />
                          <span className="text-sm">24h (8:00-8:00)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <ShiftBadge type="free" />
                          <span className="text-sm">Libre</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <ShiftBadge type="guard" />
                          <span className="text-sm">Guardia</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <ShiftBadge type="oncall" />
                          <span className="text-sm">Localizado</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <ShiftBadge type="training" />
                          <span className="text-sm">Formación</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Resumen mensual</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Total horas trabajadas:</span>
                          <span className="font-medium">{shifts.reduce((total, shift) => total + shift.hours, 0)} horas</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Días trabajados:</span>
                          <span className="font-medium">{shifts.filter(s => s.hours > 0).length} días</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Días libres:</span>
                          <span className="font-medium">{shifts.filter(s => s.type === 'free').length} días</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="hours" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Horas anuales</CardTitle>
                <CardDescription>
                  Seguimiento y gestión de horas anuales de {selectedUser.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {annualHours ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Datos base</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <dl className="space-y-2">
                            <div className="flex justify-between">
                              <dt>Horas anuales convenio:</dt>
                              <dd className="font-medium">{annualHours.baseHours}h</dd>
                            </div>
                            <div className="flex justify-between">
                              <dt>Ajuste por antigüedad:</dt>
                              <dd className="font-medium">-{annualHours.seniorityAdjustment}h</dd>
                            </div>
                            <div className="flex justify-between">
                              <dt>Total a realizar:</dt>
                              <dd className="font-medium">{annualHours.baseHours - annualHours.seniorityAdjustment}h</dd>
                            </div>
                            <div className="flex justify-between">
                              <dt>Antigüedad:</dt>
                              <dd className="font-medium">{selectedUser.seniority} años</dd>
                            </div>
                          </dl>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Horas realizadas</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <dl className="space-y-2">
                            <div className="flex justify-between">
                              <dt>Horas trabajadas:</dt>
                              <dd className="font-medium">{annualHours.workedHours}h</dd>
                            </div>
                            <div className="flex justify-between">
                              <dt>Vacaciones:</dt>
                              <dd className="font-medium">{annualHours.vacationHours}h</dd>
                            </div>
                            <div className="flex justify-between">
                              <dt>Permisos personales:</dt>
                              <dd className="font-medium">{annualHours.personalLeaveHours}h</dd>
                            </div>
                            <div className="flex justify-between">
                              <dt>Bajas médicas:</dt>
                              <dd className="font-medium">{annualHours.sickLeaveHours}h</dd>
                            </div>
                          </dl>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Balance</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <dl className="space-y-2">
                            <div className="flex justify-between">
                              <dt>Total realizado:</dt>
                              <dd className="font-medium">
                                {annualHours.workedHours + 
                                  annualHours.vacationHours + 
                                  annualHours.personalLeaveHours}h
                              </dd>
                            </div>
                            <div className="flex justify-between">
                              <dt>Horas restantes:</dt>
                              <dd className="font-medium">{annualHours.remainingHours}h</dd>
                            </div>
                            <div className="flex justify-between">
                              <dt>Progreso:</dt>
                              <dd className="font-medium">
                                {Math.round(
                                  ((annualHours.workedHours + 
                                    annualHours.vacationHours + 
                                    annualHours.personalLeaveHours) * 100) / 
                                  (annualHours.baseHours - annualHours.seniorityAdjustment)
                                )}%
                              </dd>
                            </div>
                          </dl>
                        </CardContent>
                      </Card>
                    </div>
                    
                    {/* Circunstancias especiales */}
                    {annualHours.specialCircumstances && (
                      <Card className="border-yellow-300">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg text-yellow-700">Circunstancias especiales</CardTitle>
                          <CardDescription>
                            Este trabajador tiene circunstancias especiales que afectan a su jornada
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {annualHours.specialCircumstances.hasReducedWorkday && (
                              <div>
                                <Badge variant="outline" className="mb-2">Reducción de jornada</Badge>
                                <p className="text-sm">
                                  Reducción del {annualHours.specialCircumstances.reductionPercentage}% de la jornada
                                </p>
                              </div>
                            )}
                            
                            {annualHours.specialCircumstances.hasBreastfeedingPermit && (
                              <div>
                                <Badge variant="outline" className="mb-2">Permiso de lactancia</Badge>
                                <p className="text-sm">
                                  Hasta el {
                                    annualHours.specialCircumstances.breastfeedingEndDate ? 
                                    format(new Date(annualHours.specialCircumstances.breastfeedingEndDate), 'dd/MM/yyyy') : 
                                    'fecha no especificada'
                                  }
                                </p>
                              </div>
                            )}
                            
                            {annualHours.specialCircumstances.otherPermits?.map((permit, index) => (
                              <div key={index}>
                                <Badge variant="outline" className="mb-2">{permit.type}</Badge>
                                <p className="text-sm">
                                  {permit.description} (
                                    {format(new Date(permit.startDate), 'dd/MM/yyyy')} - 
                                    {format(new Date(permit.endDate), 'dd/MM/yyyy')}
                                  )
                                </p>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                    
                    <div>
                      <Button onClick={() => generateHoursReport(selectedUser.id, currentDate.getFullYear())}>
                        <Clock className="mr-2 h-4 w-4" />
                        Generar informe de horas
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-4">
                    <p>No se encontraron datos de horas anuales para este trabajador.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="exports" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Importar y exportar datos</CardTitle>
                <CardDescription>
                  Importe o exporte los datos de calendario y turnos de {selectedUser.name}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Exportar a Excel</h3>
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="space-y-2 w-full md:w-64">
                      <Label>Mes a exportar</Label>
                      <Select defaultValue={`${currentDate.getMonth() + 1}`}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar mes" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 12 }, (_, i) => (
                            <SelectItem key={i} value={`${i + 1}`}>
                              {format(new Date(2025, i, 1), 'MMMM', { locale: es })}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2 w-full md:w-64">
                      <Label>Año</Label>
                      <Select defaultValue={`${currentDate.getFullYear()}`}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar año" />
                        </SelectTrigger>
                        <SelectContent>
                          {[2024, 2025, 2026].map(year => (
                            <SelectItem key={year} value={`${year}`}>{year}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="self-end">
                      <Button onClick={() => exportToExcel(
                        selectedUser.id,
                        currentDate.getFullYear(),
                        currentDate.getMonth() + 1
                      )}>
                        <Download className="mr-2 h-4 w-4" />
                        Exportar
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Importar desde Excel</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Suba un archivo Excel con los turnos para importar (formato .xlsx)
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <label
                        htmlFor="file-upload"
                        className="flex items-center justify-center gap-2 border border-dashed rounded-md p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                      >
                        <Upload className="h-5 w-5 text-muted-foreground" />
                        <span>Seleccionar archivo</span>
                      </label>
                      <input id="file-upload" type="file" className="hidden" accept=".xlsx,.xls" />
                    </div>
                    <Button>Importar</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
