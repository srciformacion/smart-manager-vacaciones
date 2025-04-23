
import { User } from '@/types';

// Comprueba si una fecha es día de descanso semanal
export function isWeeklyRestDay(date: Date, user: User): boolean {
  const day = date.getDay(); // 0 = domingo, 1 = lunes, etc.
  
  if (user.shift === 'Localizado') {
    return day === 0 || day === 6; // Sábado y domingo
  } else if (user.shift === 'Urgente 24h') {
    return false; // Se necesitaría una lógica más compleja
  }
  
  // Por defecto, asumimos que los fines de semana son descanso
  return day === 0 || day === 6;
}
