
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";

interface DateRangeSectionProps {
  dateFrom: Date | undefined;
  setDateFrom: (date: Date | undefined) => void;
  dateTo: Date | undefined;
  setDateTo: (date: Date | undefined) => void;
}

export function DateRangeSection({ 
  dateFrom, 
  setDateFrom, 
  dateTo, 
  setDateTo 
}: DateRangeSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label>Fecha desde</Label>
        <DatePicker
          selectedDate={dateFrom}
          onSelect={setDateFrom}
        />
      </div>
      <div className="space-y-2">
        <Label>Fecha hasta</Label>
        <DatePicker
          selectedDate={dateTo}
          onSelect={setDateTo}
        />
      </div>
    </div>
  );
}
