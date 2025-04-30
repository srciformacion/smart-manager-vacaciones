
import { Request, User } from '@/types';
import { OverlapAlert } from './types';

export class OverlapAnalyzer {
  static detect(requests: Request[], users: User[]): OverlapAlert[] {
    const alerts: OverlapAlert[] = [];
    
    // Group requests by user
    const requestsByUser: Record<string, Request[]> = {};
    requests.forEach(request => {
      if (!requestsByUser[request.userId]) {
        requestsByUser[request.userId] = [];
      }
      requestsByUser[request.userId].push(request);
    });
    
    // Analyze each user's requests
    Object.entries(requestsByUser).forEach(([userId, userRequests]) => {
      const sortedRequests = [...userRequests].sort((a, b) => 
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
      );
      
      for (let i = 0; i < sortedRequests.length - 1; i++) {
        const current = sortedRequests[i];
        const next = sortedRequests[i + 1];
        
        const currentEnd = new Date(current.endDate);
        const nextStart = new Date(next.startDate);
        
        if (currentEnd >= nextStart) {
          const user = users.find(u => u.id === userId);
          const userName = user ? user.name : 'Usuario';
          const department = user ? user.department : 'Sin departamento';
          
          alerts.push({
            userId,
            userName,
            department,
            requestId: current.id,
            startDate: new Date(current.startDate),
            endDate: new Date(current.endDate),
            overlapType: `${current.type} - ${next.type}`,
            description: `Solapamiento entre solicitudes ${current.id} y ${next.id}`,
            message: `Solapamiento detectado para ${userName}: La solicitud ${current.id} (${current.type}) 
                     se solapa con la solicitud ${next.id} (${next.type}).`
          });
        }
      }
    });
    
    return alerts;
  }
}
