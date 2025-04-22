
import { User, Request, Balance, WorkGroup } from '@/types';

// Clase para implementar la lógica inteligente de asistencia a RRHH
export default class SmartAssistant {
  
  // Detecta solapes entre solicitudes de vacaciones y descansos
  static detectOverlaps(requests: Request[], users: User[]): { userId: string; message: string }[] {
    const alerts: { userId: string; message: string }[] = [];
    
    // Agrupamos solicitudes por usuario
    const requestsByUser: Record<string, Request[]> = {};
    
    requests.forEach(request => {
      if (!requestsByUser[request.userId]) {
        requestsByUser[request.userId] = [];
      }
      requestsByUser[request.userId].push(request);
    });
    
    // Analizamos cada usuario y sus solicitudes
    Object.entries(requestsByUser).forEach(([userId, userRequests]) => {
      // Ordenamos solicitudes por fecha
      const sortedRequests = [...userRequests].sort((a, b) => 
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
      );
      
      // Buscamos solicitudes que se solapan
      for (let i = 0; i < sortedRequests.length - 1; i++) {
        const current = sortedRequests[i];
        const next = sortedRequests[i + 1];
        
        const currentEnd = new Date(current.endDate);
        const nextStart = new Date(next.startDate);
        
        // Si hay solapamiento
        if (currentEnd >= nextStart) {
          const user = users.find(u => u.id === userId);
          const userName = user ? user.name : 'Usuario';
          
          alerts.push({
            userId,
            message: `Solapamiento detectado para ${userName}: La solicitud ${current.id} (${current.type}) 
                     se solapa con la solicitud ${next.id} (${next.type}).`
          });
        }
      }
    });
    
    return alerts;
  }
  
  // Detecta si demasiados trabajadores del mismo grupo han solicitado las mismas fechas
  static detectGroupOverCrowding(
    requests: Request[], 
    users: User[]
  ): { workGroup: WorkGroup; startDate: Date; endDate: Date; count: number; message: string }[] {
    const alerts: { workGroup: WorkGroup; startDate: Date; endDate: Date; count: number; message: string }[] = [];
    
    // Agrupamos usuarios por grupo de trabajo
    const usersByGroup: Record<WorkGroup, User[]> = {} as Record<WorkGroup, User[]>;
    
    users.forEach(user => {
      if (!usersByGroup[user.workGroup]) {
        usersByGroup[user.workGroup] = [];
      }
      usersByGroup[user.workGroup].push(user);
    });
    
    // Analizamos solicitudes por fechas y grupos
    Object.entries(usersByGroup).forEach(([groupName, groupUsers]) => {
      const workGroup = groupName as WorkGroup;
      
      // Obtenemos IDs de usuarios de este grupo
      const groupUserIds = groupUsers.map(user => user.id);
      
      // Filtramos solicitudes de estos usuarios que están pendientes o aprobadas
      const groupRequests = requests.filter(req => 
        groupUserIds.includes(req.userId) && 
        (req.status === 'pending' || req.status === 'approved') &&
        req.type === 'vacation'
      );
      
      // Creamos un mapa de fechas y contamos solicitudes por fecha
      const dateCountMap: Record<string, { count: number, requests: Request[] }> = {};
      
      groupRequests.forEach(request => {
        const startDate = new Date(request.startDate);
        const endDate = new Date(request.endDate);
        
        // Para cada día en el rango de la solicitud
        const currentDate = new Date(startDate);
        while (currentDate <= endDate) {
          const dateKey = currentDate.toISOString().split('T')[0];
          
          if (!dateCountMap[dateKey]) {
            dateCountMap[dateKey] = { count: 0, requests: [] };
          }
          
          dateCountMap[dateKey].count++;
          dateCountMap[dateKey].requests.push(request);
          
          // Avanzar al día siguiente
          currentDate.setDate(currentDate.getDate() + 1);
        }
      });
      
      // Calculamos umbral para este grupo (ejemplo: 50%)
      const threshold = Math.ceil(groupUsers.length * 0.5);
      
      // Identificamos fechas con demasiadas solicitudes
      Object.entries(dateCountMap).forEach(([dateStr, { count, requests }]) => {
        if (count >= threshold) {
          // Encontramos el rango de fechas consecutivas con problema
          const date = new Date(dateStr);
          let startDate = new Date(date);
          let endDate = new Date(date);
          let currentDate = new Date(date);
          
          // Buscamos hacia atrás
          currentDate.setDate(currentDate.getDate() - 1);
          while (dateCountMap[currentDate.toISOString().split('T')[0]]?.count >= threshold) {
            startDate = new Date(currentDate);
            currentDate.setDate(currentDate.getDate() - 1);
          }
          
          // Buscamos hacia adelante
          currentDate = new Date(date);
          currentDate.setDate(currentDate.getDate() + 1);
          while (dateCountMap[currentDate.toISOString().split('T')[0]]?.count >= threshold) {
            endDate = new Date(currentDate);
            currentDate.setDate(currentDate.getDate() + 1);
          }
          
          // Creamos alerta si no existe ya una para este rango de fechas
          const alreadyAlerted = alerts.some(alert => 
            alert.workGroup === workGroup && 
            alert.startDate.getTime() === startDate.getTime() && 
            alert.endDate.getTime() === endDate.getTime()
          );
          
          if (!alreadyAlerted) {
            alerts.push({
              workGroup,
              startDate,
              endDate,
              count,
              message: `Demasiados trabajadores (${count} de ${groupUsers.length}) del grupo ${workGroup} 
                       han solicitado vacaciones entre ${startDate.toLocaleDateString()} y ${endDate.toLocaleDateString()}.`
            });
          }
        }
      });
    });
    
    return alerts;
  }
  
  // Detecta acumulación de permisos en un mismo mes
  static detectPermissionAccumulation(requests: Request[], users: User[]): { userId: string; month: number; count: number; message: string }[] {
    const alerts: { userId: string; month: number; count: number; message: string }[] = [];
    
    // Agrupamos solicitudes por usuario
    const requestsByUser: Record<string, Request[]> = {};
    
    requests.forEach(request => {
      if (request.type === 'leave' || request.type === 'personalDay') {
        if (!requestsByUser[request.userId]) {
          requestsByUser[request.userId] = [];
        }
        requestsByUser[request.userId].push(request);
      }
    });
    
    // Analizamos cada usuario y sus solicitudes por mes
    Object.entries(requestsByUser).forEach(([userId, userRequests]) => {
      // Contamos solicitudes por mes
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
      
      // Umbral para acumulación (ejemplo: más de 3 permisos en un mes)
      const threshold = 3;
      
      // Identificamos meses con acumulación
      Object.entries(requestsByMonth).forEach(([monthStr, { count, requests }]) => {
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
  
  // Detecta trabajadores cerca del límite anual sin vacaciones asignadas
  static detectVacationLimit(balances: Balance[], users: User[]): { userId: string; daysLeft: number; message: string }[] {
    const alerts: { userId: string; daysLeft: number; message: string }[] = [];
    
    // Umbral de alerta (ejemplo: menos de 10 días disponibles)
    const threshold = 10;
    
    // Obtenemos el año actual
    const currentYear = new Date().getFullYear();
    
    // Analizamos cada balance
    balances.forEach(balance => {
      // Solo nos interesan los balances del año actual
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
  
  // Análisis completo para panel de RRHH
  static analyzeAll(
    requests: Request[], 
    users: User[], 
    balances: Balance[]
  ): { 
    overlaps: { userId: string; message: string }[],
    groupCrowding: { workGroup: WorkGroup; startDate: Date; endDate: Date; count: number; message: string }[],
    permissionAccumulation: { userId: string; month: number; count: number; message: string }[],
    vacationLimit: { userId: string; daysLeft: number; message: string }[]
  } {
    return {
      overlaps: this.detectOverlaps(requests, users),
      groupCrowding: this.detectGroupOverCrowding(requests, users),
      permissionAccumulation: this.detectPermissionAccumulation(requests, users),
      vacationLimit: this.detectVacationLimit(balances, users)
    };
  }
}
