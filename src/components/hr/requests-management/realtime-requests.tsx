import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MoreVertical, Edit, CheckCircle, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { DateRange } from "react-day-picker"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"

// Define a type for the request data
type RequestData = {
  id: string;
  employee: string;
  type: string;
  startDate: Date;
  endDate: Date;
  status: string;
};

const data: RequestData[] = [
  {
    id: "1",
    employee: "Pedro Sánchez",
    type: "Vacaciones",
    startDate: new Date("2023-01-01"),
    endDate: new Date("2023-01-15"),
    status: "Pendiente",
  },
  {
    id: "2",
    employee: "María García",
    type: "Asuntos propios",
    startDate: new Date("2023-02-01"),
    endDate: new Date("2023-02-01"),
    status: "Aprobada",
  },
  {
    id: "3",
    employee: "Juan Pérez",
    type: "Baja",
    startDate: new Date("2023-03-01"),
    endDate: new Date("2023-03-15"),
    status: "Rechazada",
  },
];

export function RealTimeRequests() {
  const [requests, setRequests] = useState(data);
  const [open, setOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<RequestData | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editRequest, setEditRequest] = useState<RequestData | null>(null);
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date("2023-02-01"),
    to: new Date("2023-02-15"),
  })
  const [status, setStatus] = useState("");
  const [observations, setObservations] = useState("");

  const handleApprove = (id: string) => {
    setRequests(
      requests.map((request) =>
        request.id === id ? { ...request, status: "Aprobada" } : request
      )
    );
    toast({
      title: "Solicitud aprobada.",
      description: "La solicitud ha sido aprobada correctamente.",
    })
  };

  const handleReject = (id: string) => {
    setRequests(
      requests.map((request) =>
        request.id === id ? { ...request, status: "Rechazada" } : request
      )
    );
    toast({
      title: "Solicitud rechazada.",
      description: "La solicitud ha sido rechazada correctamente.",
    })
  };

  const handleDelete = (id: string) => {
    setRequests(requests.filter((request) => request.id !== id));
    setOpen(false);
    toast({
      title: "Solicitud eliminada.",
      description: "La solicitud ha sido eliminada correctamente.",
    })
  };

  const handleEdit = (request: RequestData) => {
    setEditRequest(request);
    setEditOpen(true);
    setDate({ from: request.startDate, to: request.endDate });
    setStatus(request.status);
    setObservations("");
  };

  const handleSaveEdit = () => {
    if (!editRequest) return;

    // Validate that date is not undefined before proceeding
    if (!date || !date.from || !date.to) {
      toast({
        variant: "destructive",
        title: "Error al guardar",
        description: "Por favor, seleccione un rango de fechas válido.",
      });
      return;
    }

    const updatedRequest: RequestData = {
      ...editRequest,
      startDate: date.from,
      endDate: date.to,
      status: status,
    };

    setRequests(
      requests.map((request) =>
        request.id === editRequest.id ? updatedRequest : request
      )
    );

    setEditRequest(null);
    setEditOpen(false);
    toast({
      title: "Solicitud editada.",
      description: "La solicitud ha sido editada correctamente.",
    })
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Solicitudes en tiempo real</CardTitle>
        <CardDescription>
          Aquí podrás ver las solicitudes de tus empleados en tiempo real.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Empleado</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Fecha de inicio</TableHead>
                <TableHead>Fecha de fin</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">{request.employee}</TableCell>
                  <TableCell>{request.type}</TableCell>
                  <TableCell>{request.startDate.toLocaleDateString()}</TableCell>
                  <TableCell>{request.endDate.toLocaleDateString()}</TableCell>
                  <TableCell>
                    {request.status === "Pendiente" && (
                      <Badge variant="secondary">{request.status}</Badge>
                    )}
                    {request.status === "Aprobada" && (
                      <Badge variant="default">{request.status}</Badge>
                    )}
                    {request.status === "Rechazada" && (
                      <Badge variant="destructive">{request.status}</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Abrir menú</span>
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => handleEdit(request)}
                        >
                          <Edit className="mr-2 h-4 w-4" /> Editar
                        </DropdownMenuItem>
                        {request.status === "Pendiente" && (
                          <>
                            <DropdownMenuItem
                              onClick={() => handleApprove(request.id)}
                            >
                              <CheckCircle className="mr-2 h-4 w-4" /> Aprobar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleReject(request.id)}
                            >
                              <AlertTriangle className="mr-2 h-4 w-4" /> Rechazar
                            </DropdownMenuItem>
                          </>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => {
                            setOpen(true);
                            setSelectedRequest(request);
                          }}
                        >
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  Total de solicitudes: {requests.length}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </ScrollArea>
      </CardContent>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará la solicitud permanentemente. ¿Estás seguro de
              que quieres continuar?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedRequest(null)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (selectedRequest) {
                  handleDelete(selectedRequest.id);
                }
              }}
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={editOpen} onOpenChange={setEditOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Editar solicitud</AlertDialogTitle>
            <AlertDialogDescription>
              Aquí podrás editar la solicitud de tu empleado.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Rango de fechas</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[240px] justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date?.from ? (
                      date.to ? (
                        format(date.from, "PPP", { locale: es }) +
                        " - " +
                        format(date.to, "PPP", { locale: es })
                      ) : (
                        format(date.from, "PPP", { locale: es })
                      )
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto p-0"
                  align="start"
                  sideOffset={4}
                >
                  <Calendar
                    mode="range"
                    defaultMonth={date?.from}
                    selected={date}
                    onSelect={setDate}
                    numberOfMonths={2}
                    locale={es}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Estado</Label>
              <Select onValueChange={setStatus} defaultValue={status}>
                <SelectTrigger className="w-[240px]">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pendiente">Pendiente</SelectItem>
                  <SelectItem value="Aprobada">Aprobada</SelectItem>
                  <SelectItem value="Rechazada">Rechazada</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="observations">Observaciones</Label>
              <Textarea
                id="observations"
                placeholder="Observaciones"
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
              />
            </div>
          </AlertDialogContent>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setEditOpen(false)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleSaveEdit}>Guardar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
