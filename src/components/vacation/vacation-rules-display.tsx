
import { User, WorkGroup } from "@/types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

interface VacationRulesDisplayProps {
  user: User;
}

export function VacationRulesDisplay({ user }: VacationRulesDisplayProps) {
  const getWorkGroupRules = (workGroup: WorkGroup): { title: string; rules: string[]; examples: string[] } => {
    switch (workGroup) {
      case 'Grupo Localizado':
        return {
          title: "Reglas para Grupo Localizado",
          rules: [
            "Las vacaciones deben tomarse en quincenas naturales completas",
            "Período 1: Del 1 al 15 de cada mes",
            "Período 2: Del 16 al último día del mes",
            "No se permiten períodos parciales"
          ],
          examples: [
            "✅ Del 1 al 15 de agosto",
            "✅ Del 16 al 31 de julio", 
            "❌ Del 5 al 19 de agosto"
          ]
        };
        
      case 'Grupo Programado':
        return {
          title: "Reglas para Grupo Programado",
          rules: [
            "Las vacaciones deben comenzar en lunes y terminar en domingo",
            "Mínimo: semanas naturales completas",
            "Alternativa: bloques de 4 días consecutivos",
            "Debe mantener la continuidad del turno"
          ],
          examples: [
            "✅ Del lunes 5 al domingo 11 de agosto",
            "✅ Bloque de 4 días: lunes a jueves",
            "❌ Del miércoles al martes siguiente"
          ]
        };
        
      case 'Urgente 24h':
        return {
          title: "Reglas para Urgente 24h",
          rules: [
            "Bloques específicos de 2 o 3 días consecutivos",
            "Alternativa: bloque largo de 32 días",
            "Debe coordinarse con cobertura de urgencias",
            "Prioridad según antigüedad en caso de conflicto"
          ],
          examples: [
            "✅ 2 días: viernes y sábado",
            "✅ 3 días: viernes, sábado y domingo",
            "✅ Bloque de 32 días en verano"
          ]
        };
        
      case 'Urgente 12h':
        return {
          title: "Reglas para Urgente 12h",
          rules: [
            "Quincenas naturales completas",
            "Del 1 al 15 o del 16 al final del mes",
            "Coordinación obligatoria con turno complementario",
            "Solicitud con 30 días de antelación mínima"
          ],
          examples: [
            "✅ Del 1 al 15 de septiembre",
            "✅ Del 16 al 30 de junio",
            "❌ Del 10 al 25 de cualquier mes"
          ]
        };
        
      case 'GES Sala Sanitaria':
        return {
          title: "Reglas para GES Sala Sanitaria",
          rules: [
            "Bloques de 10 días laborables",
            "Alternativa: bloques de 12 días laborables",
            "Debe garantizarse cobertura sanitaria",
            "Rotación equitativa entre personal"
          ],
          examples: [
            "✅ 10 días laborables consecutivos",
            "✅ 12 días laborables consecutivos",
            "❌ Períodos inferiores a 10 días"
          ]
        };
        
      case 'Top Programado':
        return {
          title: "Reglas para Top Programado",
          rules: [
            "Semanas naturales: lunes a domingo",
            "Alternativa: bloques de 4 días consecutivos",
            "Debe mantener continuidad operativa",
            "Coordinación con turnos adyacentes"
          ],
          examples: [
            "✅ Semana completa: lunes a domingo",
            "✅ 4 días: martes a viernes",
            "❌ Períodos que corten la semana laboral"
          ]
        };
        
      case 'Grupo 1/3':
        return {
          title: "Reglas para Grupo 1/3",
          rules: [
            "Quincenas naturales obligatorias",
            "Primera quincena: del 1 al 15",
            "Segunda quincena: del 16 al final del mes",
            "Rotación entre los tercios del grupo"
          ],
          examples: [
            "✅ Del 1 al 15 de octubre",
            "✅ Del 16 al 31 de diciembre",
            "❌ Cualquier otro período"
          ]
        };
        
      default:
        return {
          title: "Reglas Generales de Vacaciones",
          rules: [
            "Solicitud con antelación mínima de 15 días",
            "Máximo 22 días al año (+ días por antigüedad)",
            "No acumulables al año siguiente",
            "Aprobación sujeta a necesidades del servicio"
          ],
          examples: [
            "✅ Cualquier período dentro de los días disponibles",
            "⚠️ Verificar disponibilidad con antelación"
          ]
        };
    }
  };

  const rules = getWorkGroupRules(user.workGroup as WorkGroup);

  return (
    <Alert className="mb-6">
      <Info className="h-4 w-4" />
      <AlertTitle className="text-lg font-semibold">{rules.title}</AlertTitle>
      <AlertDescription className="mt-3 space-y-4">
        <div>
          <h4 className="font-medium text-sm mb-2">📋 Condiciones obligatorias:</h4>
          <ul className="list-disc list-inside space-y-1 text-sm">
            {rules.rules.map((rule, index) => (
              <li key={index} className="text-muted-foreground">{rule}</li>
            ))}
          </ul>
        </div>
        
        <div>
          <h4 className="font-medium text-sm mb-2">💡 Ejemplos:</h4>
          <ul className="space-y-1 text-sm">
            {rules.examples.map((example, index) => (
              <li key={index} className="text-muted-foreground">{example}</li>
            ))}
          </ul>
        </div>
        
        <div className="pt-2 border-t">
          <p className="text-xs text-muted-foreground">
            <strong>Importante:</strong> El incumplimiento de estas reglas resultará en el rechazo automático de la solicitud.
            Para casos excepcionales, contactar con RRHH con antelación.
          </p>
        </div>
      </AlertDescription>
    </Alert>
  );
}
