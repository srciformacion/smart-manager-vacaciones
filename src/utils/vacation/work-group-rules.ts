
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
        (startDate.getDate() === 1 && endDate.getDate() === 15) ||
        (startDate.getDate() === 16 && (
          endDate.getDate() === 30 ||
          endDate.getDate() === 31 ||
          (endDate.getMonth() === 1 && endDate.getDate() === 28) ||
          (endDate.getMonth() === 1 && endDate.getDate() === 29)
        ))
      );
      
      if (!isQuincena) {
        return {
          valid: false,
          message: 'Grupo personal localizado: Las vacaciones deben ser en quincenas naturales (1-15 o 16-fin de mes)'
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
          message: 'Grupo personal de programado: Las vacaciones deben ser semanas naturales (lunes a domingo) o bloque de 4 días'
        };
      }
      break;
      
    case 'Urgente 24h':
      const validBlocks = [2, 3, 32];
      if (!validBlocks.includes(durationInDays)) {
        return {
          valid: false,
          message: 'Grupo personal Urgente 24h: Debe elegir bloques de 2, 3 días o 32 días a regular defecto de horas'
        };
      }
      break;
      
    case 'Urgente 12h':
      const isQuincenaUrgente = (
        (startDate.getDate() === 1 && endDate.getDate() === 15) ||
        (startDate.getDate() === 16 && (
          endDate.getDate() === 30 ||
          endDate.getDate() === 31 ||
          (endDate.getMonth() === 1 && endDate.getDate() === 28) ||
          (endDate.getMonth() === 1 && endDate.getDate() === 29)
        ))
      );
      
      if (!isQuincenaUrgente) {
        return {
          valid: false,
          message: 'Grupo personal Urgente 12h: Las vacaciones deben ser en quincenas naturales (1-15 o 16-fin de mes)'
        };
      }
      break;
      
    case 'GES Sala Sanitaria':
      const validGESBlocks = [10, 12];
      if (!validGESBlocks.includes(durationInDays)) {
        return {
          valid: false,
          message: 'Grupo personal GES Sala Sanitaria: Debe elegir bloques de 10 o 12 días'
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
          message: 'Grupo personal Top programado: Las vacaciones deben ser semanas naturales (lunes a domingo) o bloque de 4 días'
        };
      }
      break;
      
    case 'Grupo 1/3':
      const isQuincenaGroup = (
        (startDate.getDate() === 1 && endDate.getDate() === 15) ||
        (startDate.getDate() === 16 && (
          endDate.getDate() === 30 ||
          endDate.getDate() === 31 ||
          (endDate.getMonth() === 1 && endDate.getDate() === 28) ||
          (endDate.getMonth() === 1 && endDate.getDate() === 29)
        ))
      );
      
      if (!isQuincenaGroup) {
        return {
          valid: false,
          message: 'Grupo personal 1/3: Las vacaciones deben ser en quincenas naturales (1-15 o 16-fin de mes)'
        };
      }
      break;
  }
  
  return { valid: true, message: 'Fechas válidas para el grupo de trabajo' };
}
