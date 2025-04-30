
import { Balance, User } from '@/types';
import { VacationLimitAlert } from './types';

export class VacationLimitAnalyzer {
  static detect(balances: Balance[], users: User[]): VacationLimitAlert[] {
    const alerts: VacationLimitAlert[] = [];
    const threshold = 10;
    const currentYear = new Date().getFullYear();
    
    balances.forEach(balance => {
      if (balance.year === currentYear && balance.vacationDays <= threshold) {
        const user = users.find(u => u.id === balance.userId);
        const userName = user ? user.name : 'Usuario';
        
        // Calcular fecha de expiración (fin de año)
        const expiryDate = new Date(currentYear, 11, 31); // 31 de diciembre
        
        // Calcular días hasta expiración
        const today = new Date();
        const diffTime = Math.abs(expiryDate.getTime() - today.getTime());
        const daysUntilExpiry = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        // Días pendientes (estimación basada en solicitudes pendientes)
        const pendingDays = Math.floor(balance.vacationDays * 0.3); // Ejemplo simple
        
        alerts.push({
          userId: balance.userId,
          userName,
          daysLeft: balance.vacationDays,
          pendingDays,
          expiryDate,
          daysUntilExpiry,
          message: `${userName} solo tiene ${balance.vacationDays} días de vacaciones disponibles para este año.`
        });
      }
    });
    
    return alerts;
  }
}
