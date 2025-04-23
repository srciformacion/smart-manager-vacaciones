
import { Request, User } from '@/types';

export function analyzeStaffingConflicts(
  startDate: Date,
  endDate: Date,
  department: string,
  allRequests: Request[],
  allUsers: User[]
): { hasConflict: boolean; message: string } {
  const departmentUsers = allUsers.filter(user => user.department === department);
  const totalDepartmentUsers = departmentUsers.length;
  const threshold = Math.ceil(totalDepartmentUsers * 0.3);
  
  const currentDate = new Date(startDate);
  const endDateCopy = new Date(endDate);
  
  while (currentDate <= endDateCopy) {
    const overlappingRequests = allRequests.filter(request => {
      if (request.status === 'rejected') return false;
      
      const requestStart = new Date(request.startDate);
      const requestEnd = new Date(request.endDate);
      
      return currentDate >= requestStart && currentDate <= requestEnd;
    });
    
    const usersWithOverlapping = [...new Set(overlappingRequests.map(request => request.userId))];
    const departmentUsersWithOverlapping = usersWithOverlapping.filter(userId => {
      const user = departmentUsers.find(u => u.id === userId);
      return user !== undefined;
    });
    
    if (departmentUsersWithOverlapping.length >= threshold) {
      const conflictDate = new Date(currentDate);
      return {
        hasConflict: true,
        message: `Posible déficit de personal el ${conflictDate.toLocaleDateString()}. Ya hay ${departmentUsersWithOverlapping.length} de ${totalDepartmentUsers} personas ausentes.`
      };
    }
    
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return { hasConflict: false, message: 'No se detectaron conflictos de personal' };
}
