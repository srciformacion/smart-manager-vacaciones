
import { Request, User } from "@/types";

export function validatePersonalDayRequest(
  date: Date,
  user: User,
  allRequests: Request[],
  allUsers: User[]
): { valid: boolean; message: string } {
  const sameDepUsers = allUsers.filter(u => u.department === user.department);
  const totalDepartmentUsers = sameDepUsers.length;
  
  const sameDepRequests = allRequests.filter(req => {
    if (req.status === 'rejected') return false;
    
    const reqDate = new Date(req.startDate);
    return (
      reqDate.getFullYear() === date.getFullYear() &&
      reqDate.getMonth() === date.getMonth() &&
      reqDate.getDate() === date.getDate() &&
      (req.type === 'personalDay' || req.type === 'personal-day' || req.type === 'vacation')
    );
  });
  
  const usersWithRequestsForDay = sameDepRequests
    .map(req => req.userId)
    .filter(userId => {
      const user = allUsers.find(u => u.id === userId);
      return user && user.department === user.department;
    });
  
  const uniqueUsers = [...new Set(usersWithRequestsForDay)];
  const percentageAbsent = (uniqueUsers.length / totalDepartmentUsers) * 100;
  
  if (percentageAbsent >= 10) {
    return {
      valid: false,
      message: `No se puede aprobar su solicitud porque ya hay un ${Math.round(percentageAbsent)}% del personal de su departamento ausente ese día (máximo permitido: 10%)`
    };
  }
  
  return { valid: true, message: 'Solicitud válida' };
}
