import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import { useState } from "react";
import { StatusBadge } from "@/components/hr/calendar/status-badge";

type CalendarStatus = "approved" | "rejected" | "pending" | "moreInfo";

const CalendarWithLegend = () => {
  const [date, setDate] = useState<Date>();
  const [displayMonth, setDisplayMonth] = useState(new Date());
  const [status, setStatus] = useState<CalendarStatus>("approved");

  const MonthPicker = () => {
    const handleMonthChange = (month: Date | undefined) => {
      if (month) {
        setDisplayMonth(month);
      }
    };

    return (
      <Select onValueChange={(value) => handleMonthChange(new Date(value))}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder={format(displayMonth, "MMMM yyyy")} />
        </SelectTrigger>
        <SelectContent>
          {[...Array(12)].map((_, i) => {
            const month = new Date(displayMonth.getFullYear(), i);
            return (
              <SelectItem
                key={i}
                value={month.toISOString()}
              >
                {format(month, "MMMM yyyy")}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    );
  };

  const DisplayCalendar = ({ displayMonth }: { displayMonth: Date }) => {
    return (
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {format(displayMonth, "MMMM yyyy")}
          </CardTitle>
          <MonthPicker />
        </CardHeader>
        <CardContent className="grid gap-6">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            initialFocus
            month={displayMonth}
            className="rounded-md border"
          />
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Calendario de disponibilidad</h2>
        <Select onValueChange={(value) => setStatus(value as CalendarStatus)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="approved">Aprobado</SelectItem>
            <SelectItem value="rejected">Rechazado</SelectItem>
            <SelectItem value="pending">Pendiente</SelectItem>
            <SelectItem value="moreInfo">Más información</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="legend">
        <StatusBadge status={status} className="mr-2" />
        <Label htmlFor={status}>{status}</Label>
      </div>

      <div>
        <DisplayCalendar displayMonth={displayMonth} />
        <MonthPicker />
      </div>
    </div>
  );
};

export function StaffAvailabilityCalendar() {
  const [date, setDate] = useState<Date>();
  const [displayMonth, setDisplayMonth] = useState(new Date());
  const [status, setStatus] = useState<CalendarStatus>("approved");

  const MonthPicker = () => {
    const handleMonthChange = (month: Date | undefined) => {
      if (month) {
        setDisplayMonth(month);
      }
    };

    return (
      <Select onValueChange={(value) => handleMonthChange(new Date(value))}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder={format(displayMonth, "MMMM yyyy")} />
        </SelectTrigger>
        <SelectContent>
          {[...Array(12)].map((_, i) => {
            const month = new Date(displayMonth.getFullYear(), i);
            return (
              <SelectItem
                key={i}
                value={month.toISOString()}
              >
                {format(month, "MMMM yyyy")}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    );
  };

  const DisplayCalendar = ({ displayMonth }: { displayMonth: Date }) => {
    return (
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {format(displayMonth, "MMMM yyyy")}
          </CardTitle>
          <MonthPicker />
        </CardHeader>
        <CardContent className="grid gap-6">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            initialFocus
            month={displayMonth}
            className="rounded-md border"
          />
        </CardContent>
      </Card>
    );
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Calendario de disponibilidad</h2>
        <Select onValueChange={(value) => setStatus(value as CalendarStatus)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="approved">Aprobado</SelectItem>
            <SelectItem value="rejected">Rechazado</SelectItem>
            <SelectItem value="pending">Pendiente</SelectItem>
            <SelectItem value="moreInfo">Más información</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="legend">
        <StatusBadge status={status} className="mr-2"/>
        <Label htmlFor={status}>{status}</Label>
      </div>

      <div>
        <DisplayCalendar displayMonth={displayMonth} />
        <MonthPicker />
      </div>
    </div>
  );
}
