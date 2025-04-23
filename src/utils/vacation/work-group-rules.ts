
import { WorkGroup } from '@/types';

export function validateDatesForWorkGroup(
  startDate: Date,
  endDate: Date,
  workGroup: WorkGroup
): { valid: boolean; message: string } {
  const durationInDays = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  
  switch (workGroup) {
    case 'Grupo Localizado':
      const isQuincena = (
        startDate.getDate() === 1 && endDate.getDate() === 15 ||
        startDate.getDate() === 16 && (
          endDate.getDate() === 30 ||
          endDate.getDate() === 31 ||
          (endDate.getMonth() === 1 && endDate.getDate() === 28) ||
          (endDate.getMonth() === 1 && endDate.getDate() === 29)
        )
      );
      
      if (!isQuincena) {
        return {
          valid: false,
          message: 'Las vacaciones para Grupo Localizado deben ser en quincenas naturales (1-15 o 16-fin de mes)'
        };
      }
      break;
      
    case 'Grupo Programado':
      const isMonday = startDate.getDay() === 1;
      const isSunday = endDate.getDay() === 0;
      const isWeek = isMonday && isSunday && durationInDays === 7;
      const isFourDayBlock = durationInDays === 4;
      
      if (!isWeek && !isFourDayBlock) {
        return {
          valid: false,
          message: 'Las vacaciones para Grupo Programado deben ser semanas naturales (lunes a domingo) o un bloque de 4 días'
        };
      }
      break;
      
    case 'Urgente 24h':
      if (durationInDays !== 2 && durationInDays !== 3 && durationInDays !== 32) {
        return {
          valid: false,
          message: 'Las vacaciones para Urgente 24h deben ser bloques de 2 o 3 días, o un bloque de 32 días'
        };
      }
      break;
      
    case 'Urgente 12h':
      const isQuincenaUrgente = (
        startDate.getDate() === 1 && endDate.getDate() === 15 ||
        startDate.getDate() === 16 && (
          endDate.getDate() === 30 ||
          endDate.getDate() === 31 ||
          (endDate.getMonth() === 1 && endDate.getDate() === 28) ||
          (endDate.getMonth() === 1 && endDate.getDate() === 29)
        )
      );
      
      if (!isQuincenaUrgente) {
        return {
          valid: false,
          message: 'Las vacaciones para Urgente 12h deben ser en quincenas naturales (1-15 o 16-fin de mes)'
        };
      }
      break;
      
    case 'GES Sala Sanitaria':
      if (durationInDays !== 10 && durationInDays !== 12) {
        return {
          valid: false,
          message: 'Las vacaciones para GES Sala Sanitaria deben ser bloques de 10 o 12 días'
        };
      }
      break;
      
    case 'Top Programado':
      const isMon = startDate.getDay() === 1;
      const isSun = endDate.getDay() === 0;
      const isWeekBlock = isMon && isSun && durationInDays === 7;
      const is4DayBlock = durationInDays === 4;
      
      if (!isWeekBlock && !is4DayBlock) {
        return {
          valid: false,
          message: 'Las vacaciones para Top Programado deben ser semanas naturales (lunes a domingo) o un bloque de 4 días'
        };
      }
      break;
      
    case 'Grupo 1/3':
      const isQuincenaGroup = (
        startDate.getDate() === 1 && endDate.getDate() === 15 ||
        startDate.getDate() === 16 && (
          endDate.getDate() === 30 ||
          endDate.getDate() === 31 ||
          (endDate.getMonth() === 1 && endDate.getDate() === 28) ||
          (endDate.getMonth() === 1 && endDate.getDate() === 29)
        )
      );
      
      if (!isQuincenaGroup) {
        return {
          valid: false,
          message: 'Las vacaciones para Grupo 1/3 deben ser en quincenas naturales (1-15 o 16-fin de mes)'
        };
      }
      break;
  }
  
  return { valid: true, message: 'Fechas válidas para el grupo de trabajo' };
}
