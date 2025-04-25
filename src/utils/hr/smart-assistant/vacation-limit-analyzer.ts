
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
        
        alerts.push({
          userId: balance.userId,
          daysLeft: balance.vacationDays,
          message: `${userName} solo tiene ${balance.vacationDays} días de vacaciones disponibles para este año.`
        });
      }
    });
    
    return alerts;
  }
}
