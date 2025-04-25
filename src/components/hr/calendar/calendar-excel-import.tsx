
import { useState } from "react";
import { CalendarShift, ShiftType } from "@/types/calendar";
import { User } from "@/types";
import { useCalendarExcel } from "@/hooks/hr/use-calendar-excel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Download, Upload, AlertTriangle, Save, X, Edit } from "lucide-react";

interface CalendarExcelImportProps {
  users: User[];
  existingShifts?: CalendarShift[];
  onImportComplete?: (shifts: CalendarShift[]) => void;
}

export function CalendarExcelImport({
  users,
  existingShifts = [],
  onImportComplete
}: CalendarExcelImportProps) {
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [selectedUserId, setSelectedUserId] = useState<string>("all");
  
  const {
    importedShifts,
    isLoading,
    isPreviewMode,
    handleFileImport,
    exportToExcel,
    confirmImport,
    cancelImport,
    updateShift
  } = useCalendarExcel({ users });

  // Handle file selection
  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileImport(file);
    }
  };
  
  // Handle export
  const handleExport = () => {
    const shiftsToExport = importedShifts.length > 0 ? importedShifts : existingShifts;
    let filteredShifts = [...shiftsToExport];
    
    // Apply user filter
    if (selectedUserId !== "all") {
      filteredShifts = filteredShifts.filter(shift => shift.userId === selectedUserId);
    }
    
    // Apply month filter
    if (selectedMonth) {
      filteredShifts = filteredShifts.filter(shift => {
        const shiftMonth = new Date(shift.date).getMonth() + 1;
        return shiftMonth === selectedMonth;
      });
    }
    
    exportToExcel(filteredShifts);
  };
  
  // Handle import confirmation
  const handleConfirmImport = () => {
    confirmImport();
    if (onImportComplete) {
      onImportComplete(importedShifts);
    }
  };
  
  // Get display data
  const getDisplayData = () => {
    const dataToDisplay = importedShifts.length > 0 ? importedShifts : existingShifts;
    let filteredData = [...dataToDisplay];
    
    // Apply user filter
    if (selectedUserId !== "all") {
      filteredData = filteredData.filter(shift => shift.userId === selectedUserId);
    }
    
    // Apply month filter
    if (selectedMonth) {
      filteredData = filteredData.filter(shift => {
        const shiftMonth = new Date(shift.date).getMonth() + 1;
        return shiftMonth === selectedMonth;
      });
    }
    
    return filteredData;
  };
  
  // Get user name by ID
  const getUserName = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user ? user.name : userId;
  };
  
  // Get shift type name
  const getShiftTypeName = (type: ShiftType) => {
    switch (type) {
      case 'morning': return 'Mañana';
      case 'afternoon': return 'Tarde';
      case 'night': return 'Noche';
      case '24h': return '24h';
      case 'free': return 'Libre';
      case 'guard': return 'Guardia';
      case 'unassigned': return 'Sin asignar';
      case 'training': return 'Formación';
      case 'special': return 'Especial';
      case 'oncall': return 'Localizado';
      case 'custom': return 'Personalizado';
      default: return type;
    }
  };
  
  // Handle shift type change in preview
  const handleShiftTypeChange = (shiftId: string, newType: ShiftType) => {
    const color = getShiftColor(newType);
    updateShift(shiftId, { type: newType, color });
  };
  
  // Get shift color
  const getShiftColor = (type: ShiftType): any => {
    switch (type) {
      case 'morning': return 'blue';
      case 'afternoon': return 'amber';
      case 'night': return 'indigo';
      case '24h': return 'red';
      case 'free': return 'green';
      case 'guard': return 'purple';
      case 'unassigned': return 'gray';
      case 'training': return 'orange';
      case 'special': return 'yellow';
      case 'oncall': return 'teal';
      case 'custom': return 'pink';
      default: return 'gray';
    }
  };
  
  // Handle shift hours change
  const handleHoursChange = (shiftId: string, hoursStr: string) => {
    const hours = parseFloat(hoursStr);
    if (!isNaN(hours)) {
      updateShift(shiftId, { hours });
    }
  };
  
  // Get shift badge style
  const getShiftBadgeClass = (type: ShiftType) => {
    switch (type) {
      case 'morning': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'afternoon': return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'night': return 'bg-indigo-100 text-indigo-800 border-indigo-300';
      case '24h': return 'bg-red-100 text-red-800 border-red-300';
      case 'free': return 'bg-green-100 text-green-800 border-green-300';
      case 'guard': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'unassigned': return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'training': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'special': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'oncall': return 'bg-teal-100 text-teal-800 border-teal-300';
      case 'custom': return 'bg-pink-100 text-pink-800 border-pink-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Importación y Exportación de Calendarios</CardTitle>
          <CardDescription>
            Importa datos de turnos desde Excel o exporta los calendarios actuales
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/3">
              <label 
                htmlFor="file-upload"
                className={`
                  flex items-center justify-center gap-2
                  border border-dashed rounded-md p-4 cursor-pointer
                  hover:bg-muted/50 transition-colors
                  ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                <Upload className="h-5 w-5 text-muted-foreground" />
                <span>
                  {isLoading ? 'Importando...' : 'Seleccionar archivo Excel'}
                </span>
              </label>
              <input 
                id="file-upload" 
                type="file" 
                className="hidden" 
                accept=".xlsx,.xls" 
                onChange={onFileChange}
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground mt-2">
                Formato: .xlsx o .xls con columnas para ID, Fecha, Turno, Hora Inicio, Hora Fin, Horas
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full md:w-2/3">
              <div>
                <label className="text-sm font-medium">Filtrar por trabajador</label>
                <Select 
                  value={selectedUserId} 
                  onValueChange={setSelectedUserId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todos los trabajadores" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los trabajadores</SelectItem>
                    {users.map(user => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium">Filtrar por mes</label>
                <Select 
                  value={selectedMonth.toString()} 
                  onValueChange={(val) => setSelectedMonth(parseInt(val))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar mes" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                      <SelectItem key={month} value={month.toString()}>
                        {format(new Date(2024, month - 1, 1), 'MMMM', { locale: es })}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="md:col-span-2 flex justify-end">
                <Button
                  onClick={handleExport}
                  disabled={existingShifts.length === 0 && importedShifts.length === 0}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Exportar a Excel
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Preview */}
      {isPreviewMode && (
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Vista previa de importación</CardTitle>
                <CardDescription>
                  Revisa y edita los datos antes de guardarlos
                </CardDescription>
              </div>
              <div className="flex items-center gap-1">
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                <span className="text-sm text-muted-foreground">
                  Los datos no se guardarán hasta que confirmes
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Trabajador</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Turno</TableHead>
                    <TableHead>Horario</TableHead>
                    <TableHead>Horas</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {importedShifts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">
                        No hay datos disponibles
                      </TableCell>
                    </TableRow>
                  ) : (
                    getDisplayData().map((shift) => (
                      <TableRow key={shift.id}>
                        <TableCell>{getUserName(shift.userId)}</TableCell>
                        <TableCell>
                          {format(new Date(shift.date), 'dd/MM/yyyy')}
                        </TableCell>
                        <TableCell>
                          <Select 
                            value={shift.type}
                            onValueChange={(value) => handleShiftTypeChange(shift.id, value as ShiftType)}
                          >
                            <SelectTrigger className="w-[130px]">
                              <div className="flex items-center gap-1">
                                <span className={`inline-block w-3 h-3 rounded-full ${getShiftBadgeClass(shift.type)}`} />
                                <SelectValue placeholder="Tipo" />
                              </div>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="morning">Mañana</SelectItem>
                              <SelectItem value="afternoon">Tarde</SelectItem>
                              <SelectItem value="night">Noche</SelectItem>
                              <SelectItem value="24h">24h</SelectItem>
                              <SelectItem value="free">Libre</SelectItem>
                              <SelectItem value="guard">Guardia</SelectItem>
                              <SelectItem value="training">Formación</SelectItem>
                              <SelectItem value="special">Especial</SelectItem>
                              <SelectItem value="oncall">Localizado</SelectItem>
                              <SelectItem value="unassigned">Sin asignar</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          {shift.startTime && shift.endTime ? (
                            `${shift.startTime} - ${shift.endTime}`
                          ) : (
                            <span className="text-muted-foreground">No especificado</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={shift.hours}
                            onChange={(e) => handleHoursChange(shift.id, e.target.value)}
                            className="w-16"
                            min="0"
                            max="24"
                          />
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={cancelImport}>
              <X className="mr-2 h-4 w-4" />
              Cancelar
            </Button>
            <Button onClick={handleConfirmImport}>
              <Save className="mr-2 h-4 w-4" />
              Guardar Cambios
            </Button>
          </CardFooter>
        </Card>
      )}
      
      {/* Calendar Data Table */}
      {!isPreviewMode && getDisplayData().length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Datos del calendario</CardTitle>
            <CardDescription>
              Calendario actual con los turnos asignados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Trabajador</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Turno</TableHead>
                    <TableHead>Horario</TableHead>
                    <TableHead>Horas</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getDisplayData().map((shift) => (
                    <TableRow key={shift.id}>
                      <TableCell>{getUserName(shift.userId)}</TableCell>
                      <TableCell>
                        {format(new Date(shift.date), 'dd/MM/yyyy')}
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getShiftBadgeClass(shift.type)}`}>
                          {getShiftTypeName(shift.type)}
                        </span>
                      </TableCell>
                      <TableCell>
                        {shift.startTime && shift.endTime ? (
                          `${shift.startTime} - ${shift.endTime}`
                        ) : (
                          <span className="text-muted-foreground">No especificado</span>
                        )}
                      </TableCell>
                      <TableCell>{shift.hours}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Instruction Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Instrucciones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">Formato de la plantilla Excel</h3>
              <p className="text-sm text-muted-foreground mt-1">
                La plantilla Excel debe contener al menos las siguientes columnas:
              </p>
              <ul className="list-disc list-inside text-sm text-muted-foreground mt-1 space-y-1">
                <li>ID Trabajador o Nombre del Trabajador</li>
                <li>Fecha (formato dd/mm/yyyy)</li>
                <li>Turno (Mañana, Tarde, Noche, 24h, etc.)</li>
                <li>Hora Inicio (opcional)</li>
                <li>Hora Fin (opcional)</li>
                <li>Horas (opcional)</li>
                <li>Notas (opcional)</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold">Cómo importar</h3>
              <ol className="list-decimal list-inside text-sm text-muted-foreground mt-1 space-y-1">
                <li>Haz clic en "Seleccionar archivo Excel"</li>
                <li>Selecciona tu archivo .xlsx o .xls</li>
                <li>Revisa los datos en la vista previa</li>
                <li>Edita cualquier dato incorrecto si es necesario</li>
                <li>Haz clic en "Guardar Cambios" para confirmar</li>
              </ol>
            </div>
            
            <div>
              <h3 className="font-semibold">Cómo exportar</h3>
              <ol className="list-decimal list-inside text-sm text-muted-foreground mt-1 space-y-1">
                <li>Filtra los datos por trabajador y/o mes si deseas</li>
                <li>Haz clic en "Exportar a Excel"</li>
                <li>El archivo se descargará automáticamente</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
