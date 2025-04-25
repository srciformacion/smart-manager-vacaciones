
import { Request, User } from '@/types';
import { PermissionAccumulationAlert } from './types';

export class PermissionAccumulationAnalyzer {
  static detect(requests: Request[], users: User[]): PermissionAccumulationAlert[] {
    const alerts: PermissionAccumulationAlert[] = [];
    
    const requestsByUser: Record<string, Request[]> = {};
    
    requests.forEach(request => {
      if (request.type === 'leave' || request.type === 'personalDay') {
        if (!requestsByUser[request.userId]) {
          requestsByUser[request.userId] = [];
        }
        requestsByUser[request.userId].push(request);
      }
    });
    
    Object.entries(requestsByUser).forEach(([userId, userRequests]) => {
      const requestsByMonth: Record<number, { count: number, requests: Request[] }> = {};
      
      userRequests.forEach(request => {
        const startDate = new Date(request.startDate);
        const month = startDate.getMonth();
        
        if (!requestsByMonth[month]) {
          requestsByMonth[month] = { count: 0, requests: [] };
        }
        
        requestsByMonth[month].count++;
        requestsByMonth[month].requests.push(request);
      });
      
      const threshold = 3;
      
      Object.entries(requestsByMonth).forEach(([monthStr, { count }]) => {
        const month = parseInt(monthStr);
        
        if (count >= threshold) {
          const user = users.find(u => u.id === userId);
          const userName = user ? user.name : 'Usuario';
          const monthNames = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
          
          alerts.push({
            userId,
            month,
            count,
            message: `${userName} tiene ${count} permisos solicitados en ${monthNames[month]}, lo que podría indicar una acumulación excesiva.`
          });
        }
      });
    });
    
    return alerts;
  }
}
