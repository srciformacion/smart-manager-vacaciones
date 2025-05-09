
import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { MainLayout } from "@/components/layout/main-layout";
import { useProfileAuth } from "@/hooks/profile/useProfileAuth";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { exampleWorkers } from "@/data/example-users";
import { format } from "date-fns";

interface Event { id: string; title: string; start: string; end?: string; color: string; worker: string; }

const colorPalette = ["#3182ce", "#38a169", "#dd6b20", "#d53f8c", "#805ad5"];
const OVERLOAD_THRESHOLD = 2;

const generateColorMap = () => {
  const map: Record<string, string> = {};
  exampleWorkers.forEach((w, i) => {
    map[w.name] = colorPalette[i % colorPalette.length];
  });
  return map;
};

const eventosEjemplo: Event[] = [
  { id: "1", title: "Vacaciones", start: "2025-05-12", end: "2025-05-16", color: "", worker: "Juan Pérez" },
  { id: "2", title: "Permiso médico", start: "2025-05-20", color: "", worker: "Ana López" },
  { id: "3", title: "Formación interna", start: "2025-05-25", color: "", worker: "Carlos Ruiz" },
  { id: "4", title: "Guardia", start: "2025-05-12", color: "", worker: "Maria Diaz" },
  { id: "5", title: "Guardia", start: "2025-05-12", color: "", worker: "Luis Gomez" }
];

export default function HRCalendarPage() {
  const { user } = useProfileAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [workerFilter, setWorkerFilter] = useState<string | null>(null);
  const colorMap = generateColorMap();
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    const withColors = eventosEjemplo.map(evt => ({
      ...evt,
      color: colorMap[evt.worker] || colorPalette[0]
    }));
    setEvents(withColors);
    // compute counts per date
    const c: Record<string, number> = {};
    withColors.forEach(evt => {
      const date = evt.start;
      c[date] = (c[date] || 0) + 1;
    });
    setCounts(c);
  }, []);

  const filteredEvents = workerFilter
    ? events.filter(e => e.worker === workerFilter)
    : events;

  const handleDateClick = (arg: any) => {
    alert(`Seleccionaste la fecha: ${format(arg.date, 'yyyy-MM-dd')}`);
  };

  const handleEventClick = (info: any) => {
    alert(`Evento: ${info.event.title}\nTrabajador: ${info.event.extendedProps.worker}`);
  };

  return (
    <MainLayout user={user}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Calendario global de personal</h1>
          <p className="text-muted-foreground">Visualiza ausencias, turnos y alertas de acumulación</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Filtro por trabajador</CardTitle>
              <Select
                value={workerFilter || "all"}
                onValueChange={value => setWorkerFilter(value === "all" ? null : value)}
              >
                <SelectTrigger className="w-[200px]"><SelectValue placeholder="Todos los trabajadores" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {exampleWorkers.map(w => (
                    <SelectItem key={w.id} value={w.name}>{w.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4 mb-4 flex-wrap">
              {Object.entries(colorMap).map(([name, col]) => (
                <div key={name} className="flex items-center space-x-1">
                  <span className="w-3 h-3 rounded" style={{ backgroundColor: col }} />
                  <span className="text-sm">{name}</span>
                </div>
              ))}
            </div>
            <FullCalendar
              plugins={[dayGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              events={filteredEvents}
              eventColor="auto"
              dateClick={handleDateClick}
              eventClick={handleEventClick}
              headerToolbar={{ left: 'prev,next today', center: 'title', right: '' }}
              height="auto"
              dayCellClassNames={(arg) => {
                const cnt = counts[arg.dateStr] || 0;
                return cnt > OVERLOAD_THRESHOLD ? ['bg-red-100'] : [];
              }}
            />
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
