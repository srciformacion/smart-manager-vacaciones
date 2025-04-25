
import { Request, User, WorkGroup } from '@/types';
import { GroupCrowdingAlert } from './types';

export class GroupCrowdingAnalyzer {
  static detect(requests: Request[], users: User[]): GroupCrowdingAlert[] {
    const alerts: GroupCrowdingAlert[] = [];
    
    // Group users by work group
    const usersByGroup: Record<WorkGroup, User[]> = {} as Record<WorkGroup, User[]>;
    users.forEach(user => {
      if (!usersByGroup[user.workGroup]) {
        usersByGroup[user.workGroup] = [];
      }
      usersByGroup[user.workGroup].push(user);
    });
    
    Object.entries(usersByGroup).forEach(([groupName, groupUsers]) => {
      const workGroup = groupName as WorkGroup;
      const groupUserIds = groupUsers.map(user => user.id);
      
      const groupRequests = requests.filter(req => 
        groupUserIds.includes(req.userId) && 
        (req.status === 'pending' || req.status === 'approved') &&
        req.type === 'vacation'
      );
      
      const dateCountMap: Record<string, { count: number, requests: Request[] }> = {};
      
      groupRequests.forEach(request => {
        const startDate = new Date(request.startDate);
        const endDate = new Date(request.endDate);
        
        const currentDate = new Date(startDate);
        while (currentDate <= endDate) {
          const dateKey = currentDate.toISOString().split('T')[0];
          
          if (!dateCountMap[dateKey]) {
            dateCountMap[dateKey] = { count: 0, requests: [] };
          }
          
          dateCountMap[dateKey].count++;
          dateCountMap[dateKey].requests.push(request);
          
          currentDate.setDate(currentDate.getDate() + 1);
        }
      });
      
      const threshold = Math.ceil(groupUsers.length * 0.5);
      
      Object.entries(dateCountMap).forEach(([dateStr, { count }]) => {
        if (count >= threshold) {
          const date = new Date(dateStr);
          let startDate = new Date(date);
          let endDate = new Date(date);
          
          alerts.push({
            workGroup,
            startDate,
            endDate,
            count,
            message: `Demasiados trabajadores (${count} de ${groupUsers.length}) del grupo ${workGroup} 
                     han solicitado vacaciones entre ${startDate.toLocaleDateString()} y ${endDate.toLocaleDateString()}.`
          });
        }
      });
    });
    
    return alerts;
  }
}
