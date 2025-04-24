
import { useState, useMemo } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar as CalendarIcon } from "lucide-react";
import { es } from "date-fns/locale";
import { format, addDays, isSameDay } from "date-fns";
import { Request, User, Department } from "@/types";

interface StaffAvailabilityCalendarProps {
  requests: Request[];
  users: User[];
  departments: Department[];
}

export function StaffAvailabilityCalendar({
  requests,
  users,
  departments,
}: StaffAvailabilityCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedDepartment, setSelectedDepartment] = useState<Department | "all">("all");

  // Obtener todos los usuarios del departamento seleccionado
  const filteredUsers = useMemo(() => {
    if (selectedDepartment === "all") {
      return users;
    }
    return users.filter((user) => user.department === selectedDepartment);
  }, [users, selectedDepartment]);

  // Contar solicitudes por día
  const daysWithAbsences = useMemo(() => {
    const absenceMap = new Map<string, number>();
    
    requests.forEach((request) => {
      if (request.status !== "approved" && request.status !== "pending") return;
      
      const requestUser = users.find((user) => user.id === request.userId);
      if (!requestUser) return;
      
      if (selectedDepartment !== "all" && requestUser.department !== selectedDepartment) {
        return;
      }
      
      let currentDate = new Date(request.startDate);
      const endDate = new Date(request.endDate);
      
      while (currentDate <= endDate) {
        const dateKey = format(currentDate, "yyyy-MM-dd");
        const currentCount = absenceMap.get(dateKey) || 0;
        absenceMap.set(dateKey, currentCount + 1);
        
        currentDate = addDays(currentDate, 1);
      }
    });
    
    return absenceMap;
  }, [requests, users, selectedDepartment]);

  // Obtener solicitudes para el día seleccionado
  const selectedDayRequests = useMemo(() => {
    if (!selectedDate) return [];
    
    return requests.filter((request) => {
      const requestStart = new Date(request.startDate);
      const requestEnd = new Date(request.endDate);
      
      const isInDateRange = selectedDate >= requestStart && selectedDate <= requestEnd;
      
      if (!isInDateRange) return false;
      
      // Si hay un departamento seleccionado, filtrar solicitudes de ese departamento
      if (selectedDepartment !== "all") {
        const user = users.find((u) => u.id === request.userId);
        return user && user.department === selectedDepartment;
      }
      
      return true;
    });
  }, [requests, selectedDate, selectedDepartment, users]);

  // Calcular disponibilidad para el departamento seleccionado
  const departmentAvailability = useMemo(() => {
    if (!selectedDate) return { total: 0, available: 0, percentage: 0 };
    
    const totalStaff = filteredUsers.length;
    const unavailableStaff = selectedDayRequests.length;
    const availableStaff = totalStaff - unavailableStaff;
    const availabilityPercentage = totalStaff > 0 ? (availableStaff / totalStaff) * 100 : 0;
    
    return {
      total: totalStaff,
      available: availableStaff,
      percentage: Math.round(availabilityPercentage),
    };
  }, [filteredUsers, selectedDayRequests, selectedDate]);

  // Función para renderizar el contenido de cada día en el calendario
  const renderDayContent = (day: Date) => {
    const dateKey = format(day, "yyyy-MM-dd");
    const absenceCount = daysWithAbsences.get(dateKey) || 0;
    const totalUsers = filteredUsers.length;
    
    if (absenceCount === 0) return null;
    
    const availablePercentage = ((totalUsers - absenceCount) / totalUsers) * 100;
    
    // Color según disponibilidad
    let bgColor = "bg-success/20";
    if (availablePercentage < 70) bgColor = "bg-warning/20";
    if (availablePercentage < 50) bgColor = "bg-danger/20";
    
    return (
      <div className={`absolute bottom-0 left-0 right-0 h-1 ${bgColor}`} />
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <CalendarIcon className="h-5 w-5" />
          Calendario de disponibilidad
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-1">
            <div className="space-y-4">
              <div>
                <Select 
                  value={selectedDepartment} 
                  onValueChange={(value) => setSelectedDepartment(value as any)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione departamento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los departamentos</SelectItem>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {selectedDate && (
                <div className="space-y-3">
                  <div className="text-sm font-medium">
                    {format(selectedDate, "PPPP", { locale: es })}
                  </div>
                  
                  <div className="rounded-lg border border-border p-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="text-sm font-medium">Disponibilidad:</div>
                      <Badge 
                        className={
                          departmentAvailability.percentage > 70 
                            ? "bg-success/20 text-success" 
                            : departmentAvailability.percentage > 50 
                            ? "bg-warning/20 text-warning" 
                            : "bg-danger/20 text-danger"
                        }
                      >
                        {departmentAvailability.percentage}%
                      </Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Personal disponible:</span>
                      <span>{departmentAvailability.available} / {departmentAvailability.total}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Personal ausente:</div>
                    {selectedDayRequests.length > 0 ? (
                      <div className="rounded-lg border border-border overflow-hidden">
                        {selectedDayRequests.map((request, index) => {
                          const user = users.find((u) => u.id === request.userId);
                          return (
                            <div key={request.id}>
                              {index > 0 && <Separator />}
                              <div className="p-2">
                                <div className="font-medium text-sm">{user?.name || "Usuario desconocido"}</div>
                                <div className="text-xs text-muted-foreground flex justify-between">
                                  <span>
                                    {request.type === "vacation" ? "Vacaciones" : 
                                     request.type === "personalDay" ? "Asunto propio" : 
                                     request.type === "leave" ? "Permiso" : "Cambio de turno"}
                                  </span>
                                  <StatusBadge status={request.status} className="text-xs" />
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground">No hay ausencias registradas para este día.</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="md:col-span-2">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              locale={es}
              className="border rounded-md p-2"
              components={{
                DayContent: ({ date, ...props }) => (
                  <div className="relative w-full h-full">
                    <div {...props} />
                    {renderDayContent(date)}
                  </div>
                ),
              }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
