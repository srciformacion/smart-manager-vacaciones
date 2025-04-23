
import { Request, User } from "@/types";
import { isWeeklyRestDay } from '../weekly-rest';
import { validateDatesForWorkGroup } from '../work-group-rules';

export function validateShiftChangeRequest(
  startDate: Date,
  endDate: Date,
  user: User,
  replacementUser: User | null,
  existingRequests: Request[]
): { valid: boolean; message: string } {
  // Validar que hay un usuario de reemplazo
  if (!replacementUser) {
    return {
      valid: false,
      message: 'Debe seleccionar un trabajador para el reemplazo'
    };
  }

  // Validar que el día no sea un día de descanso semanal
  if (isWeeklyRestDay(startDate, user)) {
    return {
      valid: false,
      message: 'No se puede solicitar cambio de turno en un día de descanso'
    };
  }

  // Validar que el usuario de reemplazo no tenga otra solicitud para ese día
  const replacementHasRequests = existingRequests.some(request => {
    if (request.status === 'rejected') return false;
    if (request.userId !== replacementUser.id) return false;

    const requestStart = new Date(request.startDate);
    const requestEnd = new Date(request.endDate);

    return (
      (startDate >= requestStart && startDate <= requestEnd) ||
      (endDate >= requestStart && endDate <= requestEnd)
    );
  });

  if (replacementHasRequests) {
    return {
      valid: false,
      message: 'El trabajador de reemplazo ya tiene otra solicitud en esas fechas'
    };
  }

  // Validar que las fechas sean válidas para el grupo de trabajo
  const isValidForGroup = validateDatesForWorkGroup(startDate, endDate, user.workGroup);
  if (!isValidForGroup.valid) {
    return isValidForGroup;
  }

  return { valid: true, message: 'Solicitud válida' };
}
