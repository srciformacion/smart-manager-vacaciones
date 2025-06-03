
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Clock, Euro, TrendingUp, Users, Award, Briefcase } from "lucide-react";
import { useOvertimeCosts, OvertimeCostCalculation, WorkerOvertimeData } from "@/hooks/hr/use-overtime-costs";

interface OvertimeCostsSectionProps {
  workersData: WorkerOvertimeData[];
  showDetailedBreakdown?: boolean;
}

export function OvertimeCostsSection({ workersData, showDetailedBreakdown = true }: OvertimeCostsSectionProps) {
  const {
    calculateOvertimeCosts,
    getTotalOvertimeCosts,
    getOvertimeCostsByDepartment,
    getOvertimeCostsByPosition
  } = useOvertimeCosts();

  const overtimeCalculations = calculateOvertimeCosts(workersData);
  const totalCosts = getTotalOvertimeCosts(overtimeCalculations);
  const costsByDepartment = getOvertimeCostsByDepartment(overtimeCalculations, workersData);
  const costsByPosition = getOvertimeCostsByPosition(overtimeCalculations);
  const totalOvertimeHours = overtimeCalculations.reduce((sum, calc) => sum + calc.overtimeHours, 0);

  const formatCurrency = (amount: number) => new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount);

  const getPositionIcon = (position: string) => {
    const pos = position.toLowerCase();
    if (pos.includes('conductor')) return <Briefcase className="h-4 w-4" />;
    if (pos.includes('tecnico') || pos.includes('técnico')) return <Award className="h-4 w-4" />;
    return <Users className="h-4 w-4" />;
  };

  const getPositionColor = (position: string) => {
    const pos = position.toLowerCase();
    if (pos.includes('conductor')) return 'bg-blue-100 text-blue-800';
    if (pos.includes('tecnico') || pos.includes('técnico')) return 'bg-green-100 text-green-800';
    if (pos.includes('medico') || pos.includes('médico')) return 'bg-purple-100 text-purple-800';
    if (pos.includes('enfermero') || pos.includes('enfermera')) return 'bg-pink-100 text-pink-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Resumen general */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Euro className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Costo Total</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(totalCosts)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Horas Extras</p>
                <p className="text-2xl font-bold text-blue-600">{totalOvertimeHours.toFixed(1)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Trabajadores</p>
                <p className="text-2xl font-bold text-purple-600">{overtimeCalculations.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Costo Promedio/Hora</p>
                <p className="text-2xl font-bold text-orange-600">
                  {formatCurrency(totalOvertimeHours > 0 ? totalCosts / totalOvertimeHours : 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Análisis por departamento */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Costos por Departamento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(costsByDepartment)
              .sort(([,a], [,b]) => b - a)
              .map(([department, cost]) => {
                const percentage = (cost / totalCosts) * 100;
                return (
                  <div key={department} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{department}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{percentage.toFixed(1)}%</Badge>
                        <span className="font-bold">{formatCurrency(cost)}</span>
                      </div>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                );
              })}
          </div>
        </CardContent>
      </Card>

      {/* Análisis por posición */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Análisis por Posición
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(costsByPosition)
              .sort(([,a], [,b]) => b.totalCost - a.totalCost)
              .map(([position, data]) => (
                <Card key={position} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      {getPositionIcon(position)}
                      <Badge className={getPositionColor(position)}>
                        {position}
                      </Badge>
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Trabajadores:</span>
                        <span className="font-medium">{data.count}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Costo total:</span>
                        <span className="font-medium">{formatCurrency(data.totalCost)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Promedio:</span>
                        <span className="font-medium">{formatCurrency(data.averageCost)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Detalle por trabajador */}
      {showDetailedBreakdown && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Detalle por Trabajador
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Trabajador</TableHead>
                    <TableHead>Posición</TableHead>
                    <TableHead>Antigüedad</TableHead>
                    <TableHead>Horas Extras</TableHead>
                    <TableHead>Tarifa/Hora</TableHead>
                    <TableHead>Multiplicadores</TableHead>
                    <TableHead className="text-right">Costo Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {overtimeCalculations
                    .sort((a, b) => b.totalCost - a.totalCost)
                    .map((calc) => (
                      <TableRow key={calc.userId}>
                        <TableCell className="font-medium">{calc.name}</TableCell>
                        <TableCell>
                          <Badge className={getPositionColor(calc.position)}>
                            {calc.position}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Award className="h-4 w-4 text-amber-500" />
                            {calc.seniorityYears} años
                          </div>
                        </TableCell>
                        <TableCell>{calc.overtimeHours.toFixed(1)}h</TableCell>
                        <TableCell>{formatCurrency(calc.costPerHour)}</TableCell>
                        <TableCell>
                          <div className="text-xs space-y-1">
                            <div>Antigüedad: x{calc.seniorityMultiplier}</div>
                            <div>Posición: x{calc.positionMultiplier}</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-bold">
                          {formatCurrency(calc.totalCost)}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
