
import { Request, User } from "@/types";

export function validateShiftChangeRequest(
  startDate: Date,
  returnDate: Date,
  replacement: User,
  user: User,
  requests: Request[],
  currentDate: Date
): { valid: boolean; message: string } {
  if (returnDate <= startDate) {
    return {
      valid: false,
      message: "La fecha de devolución debe ser posterior a la fecha del cambio"
    };
  }

  const hasUserOverlap = requests.some(req => {
    if (req.userId === user.id && req.status !== 'rejected') {
      const reqDate = new Date(req.startDate);
      
      return (
        reqDate.getDate() === startDate.getDate() &&
        reqDate.getMonth() === startDate.getMonth() &&
        reqDate.getFullYear() === startDate.getFullYear()
      );
    }
    return false;
  });

  if (hasUserOverlap) {
    return {
      valid: false,
      message: "Ya tiene una solicitud aprobada o pendiente para este día"
    };
  }

  const hasReturnOverlap = requests.some(req => {
    if ((req.userId === user.id || req.userId === replacement.id) && req.status !== 'rejected') {
      const reqDate = new Date(req.startDate);
      
      return (
        reqDate.getDate() === returnDate.getDate() &&
        reqDate.getMonth() === returnDate.getMonth() &&
        reqDate.getFullYear() === returnDate.getFullYear()
      );
    }
    return false;
  });

  if (hasReturnOverlap) {
    return {
      valid: false,
      message: "Ya existe una solicitud para la fecha de devolución"
    };
  }

  const hasReplacementOverlap = requests.some(req => {
    if (req.userId === replacement.id && req.status !== 'rejected') {
      const reqDate = new Date(req.startDate);
      
      return (
        reqDate.getDate() === startDate.getDate() &&
        reqDate.getMonth() === startDate.getMonth() &&
        reqDate.getFullYear() === startDate.getFullYear()
      );
    }
    return false;
  });

  if (hasReplacementOverlap) {
    return {
      valid: false,  
      message: "El compañero de reemplazo ya tiene una solicitud para esta fecha"
    };
  }
  
  if (replacement.department !== user.department) {
    return {
      valid: false,
      message: "El compañero de reemplazo debe ser del mismo departamento"
    };
  }
  
  if (replacement.shift !== user.shift) {
    return {
      valid: false,
      message: "El compañero de reemplazo debe tener el mismo turno"
    };
  }

  return { valid: true, message: 'Solicitud válida' };
}
