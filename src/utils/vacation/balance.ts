
import { User, Balance } from '@/types';

export function calculateAvailableDays(user: User, balance: Balance): Balance {
  const updatedBalance = { ...balance };
  
  const baseVacationDays = 22;
  const additionalVacationDays = Math.floor(user.seniority / 5);
  updatedBalance.vacationDays = baseVacationDays + additionalVacationDays;
  
  let personalDays = 3;
  
  if (user.seniority >= 25) {
    personalDays += 2;
  } else if (user.seniority >= 15) {
    personalDays += 1;
  }
  
  updatedBalance.personalDays = personalDays;
  
  return updatedBalance;
}
