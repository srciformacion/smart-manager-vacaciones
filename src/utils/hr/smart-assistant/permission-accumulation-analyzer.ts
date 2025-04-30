
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
      
      Object.entries(requestsByMonth).forEach(([monthStr, { count, requests }]) => {
        const month = parseInt(monthStr);
        
        if (count >= threshold) {
          const user = users.find(u => u.id === userId);
          const userName = user ? user.name : 'Usuario';
          const department = user ? user.department : 'Sin departamento';
          const monthNames = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
          
          // Encontrar el permiso más reciente
          const sortedRequests = [...requests].sort((a, b) => 
            new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
          );
          const lastPermissionDate = sortedRequests.length > 0 
            ? new Date(sortedRequests[0].startDate) 
            : new Date();
          
          // Calcular días totales de permisos
          let totalDays = 0;
          requests.forEach(req => {
            const start = new Date(req.startDate);
            const end = new Date(req.endDate);
            const diffTime = Math.abs(end.getTime() - start.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
            totalDays += diffDays;
          });
          
          // Contar permisos pendientes
          const pendingCount = requests.filter(req => req.status === 'pending').length;
          
          alerts.push({
            userId,
            userName,
            department,
            month,
            count,
            pendingCount,
            totalDays,
            lastPermissionDate,
            message: `${userName} tiene ${count} permisos solicitados en ${monthNames[month]}, lo que podría indicar una acumulación excesiva.`
          });
        }
      });
    });
    
    return alerts;
  }
}
