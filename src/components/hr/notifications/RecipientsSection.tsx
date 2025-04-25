
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { exampleWorkers } from "@/data/example-users";
import { RecipientsProps } from "./types";

export function RecipientsSection({ selectedWorker, setSelectedWorker, recipients, onRecipientsChange }: RecipientsProps) {
  return (
    <div className="space-y-2">
      <Label>Destinatarios</Label>
      <Select 
        value={selectedWorker} 
        onValueChange={setSelectedWorker}
      >
        <SelectTrigger>
          <SelectValue placeholder="Seleccionar destinatario" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="all">Todos los trabajadores</SelectItem>
            {exampleWorkers.map(worker => (
              <SelectItem key={worker.id} value={worker.id}>
                {worker.name} - {worker.department}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      
      <p className="text-xs text-muted-foreground mt-1">O introduce direcciones de correo electrónico separadas por comas</p>
      <Input
        placeholder="ejemplo@email.com, otro@email.com"
        disabled={!!selectedWorker}
        value={recipients}
        onChange={(e) => onRecipientsChange(e.target.value)}
      />
    </div>
  );
}
