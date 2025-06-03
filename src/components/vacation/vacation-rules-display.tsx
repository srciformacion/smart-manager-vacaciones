
import { User, WorkGroup } from "@/types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

interface VacationRulesDisplayProps {
  user: User;
}

export function VacationRulesDisplay({ user }: VacationRulesDisplayProps) {
  const getWorkGroupRules = (workGroup: WorkGroup): { title: string; rules: string[]; examples: string[]; additionalInfo: string[] } => {
    switch (workGroup) {
      case 'Grupo Localizado':
        return {
          title: "Grupo personal localizado",
          rules: [
            "Las vacaciones deben tomarse en quincenas naturales completas",
            "Primera quincena: Del 1 al 15 de cada mes",
            "Segunda quincena: Del 16 al último día del mes"
          ],
          examples: [
            "✅ Del 1 al 15 de agosto",
            "✅ Del 16 al 31 de julio", 
            "❌ Del 5 al 19 de agosto"
          ],
          additionalInfo: [
            "No se permiten períodos parciales o que no coincidan con las quincenas naturales"
          ]
        };
        
      case 'Grupo Programado':
        return {
          title: "Grupo personal de programado",
          rules: [
            "Semanas naturales de lunes a domingo",
            "Alternativa: Bloque de 4 días",
            "El bloque de 4 días podrá anexionarse a la semana opcional por cuestiones organizativas"
          ],
          examples: [
            "✅ Del lunes al domingo (semana completa)",
            "✅ Bloque de 4 días consecutivos",
            "❌ Del miércoles al martes siguiente"
          ],
          additionalInfo: [
            "Los bloques pueden combinarse según necesidades organizativas"
          ]
        };
        
      case 'Urgente 24h':
        return {
          title: "Grupo personal Urgente 24h",
          rules: [
            "Tres bloques de guardias: 2, 3 o 2 días",
            "Alternativa: 32 días a regular defecto de horas",
            "Debe coordinarse con la cobertura de urgencias 24h"
          ],
          examples: [
            "✅ Bloque de 2 días",
            "✅ Bloque de 3 días",
            "✅ 32 días para regular defecto de horas"
          ],
          additionalInfo: [
            "La empresa ajustará la jornada por horas de exceso o defecto dentro del calendario anual"
          ]
        };
        
      case 'Urgente 12h':
        return {
          title: "Grupo personal Urgente 12h",
          rules: [
            "Las vacaciones deben tomarse en quincenas naturales",
            "Primera quincena: Del 1 al 15 de cada mes",
            "Segunda quincena: Del 16 al último día del mes"
          ],
          examples: [
            "✅ Del 1 al 15 de septiembre",
            "✅ Del 16 al 30 de junio",
            "❌ Del 10 al 25 de cualquier mes"
          ],
          additionalInfo: [
            "Debe coordinarse con el turno de 12 horas complementario"
          ]
        };
        
      case 'GES Sala Sanitaria':
        return {
          title: "Grupo personal GES Sala Sanitaria",
          rules: [
            "Tres bloques de días: 10, 10 y 12 días",
            "Los bloques deben ser consecutivos",
            "Debe garantizarse la cobertura sanitaria en todo momento"
          ],
          examples: [
            "✅ Bloque de 10 días consecutivos",
            "✅ Bloque de 12 días consecutivos",
            "❌ Períodos inferiores a 10 días"
          ],
          additionalInfo: [
            "La distribución debe respetar las necesidades del servicio sanitario"
          ]
        };
        
      case 'Top Programado':
        return {
          title: "Grupo personal Top programado",
          rules: [
            "Semanas naturales de lunes a domingo",
            "Alternativa: Bloque de 4 días",
            "Debe mantener la continuidad operativa del servicio"
          ],
          examples: [
            "✅ Semana completa: lunes a domingo",
            "✅ Bloque de 4 días consecutivos",
            "❌ Períodos que corten la continuidad semanal"
          ],
          additionalInfo: [
            "Los bloques pueden anexionarse según cuestiones organizativas"
          ]
        };
        
      case 'Grupo 1/3':
        return {
          title: "Grupo personal 1/3",
          rules: [
            "Las vacaciones deben tomarse en quincenas naturales",
            "Primera quincena: Del 1 al 15 de cada mes", 
            "Segunda quincena: Del 16 al último día del mes"
          ],
          examples: [
            "✅ Del 1 al 15 de octubre",
            "✅ Del 16 al 31 de diciembre",
            "❌ Cualquier otro período que no sea quincena natural"
          ],
          additionalInfo: [
            "Debe respetarse la rotación entre los tercios del grupo"
          ]
        };
        
      default:
        return {
          title: "Normas Generales de Vacaciones",
          rules: [
            "Solicitud con antelación según normativa interna",
            "Días asignados según convenio y antigüedad",
            "Sujeto a necesidades organizativas del servicio"
          ],
          examples: [
            "⚠️ Verificar grupo de trabajo específico"
          ],
          additionalInfo: [
            "Consultar con RRHH para casos no contemplados"
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
          <h4 className="font-medium text-sm mb-2">📋 Normas específicas del grupo:</h4>
          <ul className="list-disc list-inside space-y-1 text-sm">
            {rules.rules.map((rule, index) => (
              <li key={index} className="text-muted-foreground">{rule}</li>
            ))}
          </ul>
        </div>
        
        <div>
          <h4 className="font-medium text-sm mb-2">💡 Ejemplos de aplicación:</h4>
          <ul className="space-y-1 text-sm">
            {rules.examples.map((example, index) => (
              <li key={index} className="text-muted-foreground">{example}</li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-medium text-sm mb-2">ℹ️ Información adicional:</h4>
          <ul className="list-disc list-inside space-y-1 text-sm">
            {rules.additionalInfo.map((info, index) => (
              <li key={index} className="text-muted-foreground">{info}</li>
            ))}
          </ul>
        </div>
        
        <div className="pt-2 border-t bg-amber-50 p-3 rounded">
          <h4 className="font-medium text-sm mb-2 text-amber-800">⚠️ Normas generales importantes:</h4>
          <ul className="list-disc list-inside space-y-1 text-xs text-amber-700">
            <li>Las vacaciones no pueden iniciarse en días de descanso semanal (salvo pacto organizativo)</li>
            <li>Si no se presentan solicitudes en plazo, la empresa asignará las fechas respetando las opciones del grupo</li>
            <li>La empresa puede modificar turnos por razones organizativas si el servicio no puede quedar descubierto</li>
            <li>Se ajustará la jornada por horas de exceso o defecto dentro del calendario anual</li>
            <li>Se restarán 8 horas por día de antigüedad generado al calendario anual</li>
          </ul>
        </div>
      </AlertDescription>
    </Alert>
  );
}
