
import { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface VacationSuggestionsProps {
  suggestions: DateRange[];
  onSelectSuggestion: (suggestion: DateRange) => void;
}

export function VacationSuggestions({ suggestions, onSelectSuggestion }: VacationSuggestionsProps) {
  if (suggestions.length === 0) return null;

  return (
    <div className="bg-warning/10 border border-warning/20 rounded-lg p-4 space-y-3">
      <h3 className="font-medium">Fechas alternativas sugeridas:</h3>
      <div className="grid gap-2 md:grid-cols-3">
        {suggestions.map((suggestion, index) => (
          <Button
            key={index}
            variant="outline"
            className="text-xs justify-start font-normal"
            onClick={() => onSelectSuggestion(suggestion)}
          >
            {format(suggestion.from!, "PPP", { locale: es })} -{" "}
            {format(suggestion.to!, "PPP", { locale: es })}
          </Button>
        ))}
      </div>
    </div>
  );
}
