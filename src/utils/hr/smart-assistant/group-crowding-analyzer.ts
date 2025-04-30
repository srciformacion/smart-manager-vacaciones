
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

          // Determinar el departamento (tomando el más común en el grupo)
          const departmentCounts: Record<string, number> = {};
          groupUsers.forEach(user => {
            if (!departmentCounts[user.department]) {
              departmentCounts[user.department] = 0;
            }
            departmentCounts[user.department]++;
          });

          let department = "Varios";
          let maxCount = 0;
          Object.entries(departmentCounts).forEach(([dept, count]) => {
            if (count > maxCount) {
              department = dept;
              maxCount = count;
            }
          });

          const absenceCount = count;
          const totalWorkers = groupUsers.length;
          const absencePercentage = (absenceCount / totalWorkers) * 100;

          // Determinar nivel de riesgo
          let riskLevel = "bajo";
          if (absencePercentage > 75) {
            riskLevel = "alto";
          } else if (absencePercentage > 50) {
            riskLevel = "medio";
          }
          
          alerts.push({
            workGroup,
            department,
            startDate,
            endDate,
            date,
            count,
            absenceCount,
            totalWorkers,
            absencePercentage,
            riskLevel,
            message: `Demasiados trabajadores (${count} de ${groupUsers.length}) del grupo ${workGroup} 
                     han solicitado vacaciones entre ${startDate.toLocaleDateString()} y ${endDate.toLocaleDateString()}.`
          });
        }
      });
    });
    
    return alerts;
  }
}
