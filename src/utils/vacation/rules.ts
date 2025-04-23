
import { WorkGroup } from "@/types";

export function getVacationRules(workGroup: WorkGroup): string {
  switch (workGroup) {
    case 'Grupo Localizado':
    case 'Urgente 12h':
    case 'Grupo 1/3':
      return "Las vacaciones deben comenzar el día 1 o 16 del mes";
    case 'Grupo Programado':
    case 'Top Programado':
      return "Las vacaciones deben comenzar en lunes";
    default:
      return "No hay restricciones especiales para las fechas de vacaciones";
  }
}
