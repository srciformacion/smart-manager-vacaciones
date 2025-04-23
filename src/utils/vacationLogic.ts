
import { WorkGroup } from "@/types";

export const validateDatesForWorkGroup = (
  startDate: Date,
  endDate: Date,
  workGroup: WorkGroup
): { valid: boolean; message?: string } => {
  if (!startDate || !endDate) {
    return { valid: false, message: "Fechas inválidas" };
  }

  switch (workGroup) {
    case 'Grupo Localizado':
    case 'Urgente 12h':
    case 'Grupo 1/3':
      // Solo permitir seleccionar desde el 1 o el 16 de cada mes
      const day = startDate.getDate();
      if (day !== 1 && day !== 16) {
        return {
          valid: false,
          message: "Las vacaciones deben comenzar el día 1 o 16 del mes"
        };
      }
      break;
    case 'Grupo Programado':
    case 'Top Programado':
      // Solo permitir seleccionar desde el lunes
      if (startDate.getDay() !== 1) {
        return {
          valid: false,
          message: "Las vacaciones deben comenzar en lunes"
        };
      }
      break;
  }

  return { valid: true };
};

export const getVacationRules = (workGroup: WorkGroup): string => {
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
};

