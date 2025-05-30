
// Service worker personalizado para extender la funcionalidad del generado por vite-plugin-pwa

// Workbox manifest injection point - this must be here for the build to work
self.__WB_MANIFEST;

// Esta función será ejecutada cuando se registre una sincronización en segundo plano
self.addEventListener('sync', (event) => {
  console.log('Sync event detected:', event.tag);
  
  if (event.tag === 'sync-pending-requests') {
    event.waitUntil(syncPendingRequests());
  }
});

// Función para sincronizar solicitudes pendientes cuando se recupera la conectividad
async function syncPendingRequests() {
  console.log('Ejecutando sincronización de solicitudes pendientes');
  
  try {
    // Obtener solicitudes pendientes de localStorage
    const pendingRequestsStr = await self.clients.matchAll().then(clients => {
      return new Promise(resolve => {
        // Si hay clientes activos, pedirles que ejecuten la sincronización
        if (clients.length > 0) {
          const client = clients[0];
          client.postMessage({
            type: 'GET_PENDING_REQUESTS'
          });
          
          // Configurar listener para recibir la respuesta
          self.addEventListener('message', function handler(event) {
            if (event.data && event.data.type === 'PENDING_REQUESTS_DATA') {
              self.removeEventListener('message', handler);
              resolve(event.data.pendingRequests);
            }
          });
        } else {
          // Si no hay clientes, leer directamente de IndexedDB
          resolve(null);
        }
      });
    });

    if (!pendingRequestsStr) {
      console.log('No hay solicitudes pendientes para sincronizar');
      return;
    }
    
    const pendingRequests = JSON.parse(pendingRequestsStr);
    
    if (!Array.isArray(pendingRequests) || pendingRequests.length === 0) {
      console.log('No hay solicitudes pendientes para sincronizar');
      return;
    }
    
    console.log(`Sincronizando ${pendingRequests.length} solicitudes pendientes`);
    
    // Aquí haríamos las llamadas a la API para enviar las solicitudes
    // Como en un service worker no tenemos acceso directo a Supabase,
    // utilizaremos fetch para enviar las solicitudes al servidor
    
    const results = await Promise.all(
      pendingRequests.map(async (request) => {
        try {
          // Hacer la solicitud a la API
          const response = await fetch('/api/requests', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(request)
          });
          
          if (!response.ok) {
            throw new Error(`Error en la respuesta: ${response.status}`);
          }
          
          return { success: true, request };
        } catch (error) {
          console.error('Error al sincronizar solicitud:', error);
          return { success: false, request, error };
        }
      })
    );
    
    // Notificar a los clientes sobre el resultado de la sincronización
    const successCount = results.filter(r => r.success).length;
    
    self.clients.matchAll().then(clients => {
      clients.forEach(client => {
        client.postMessage({
          type: 'SYNC_COMPLETED',
          results: {
            total: pendingRequests.length,
            success: successCount,
            failed: pendingRequests.length - successCount
          }
        });
      });
    });
    
  } catch (error) {
    console.error('Error durante la sincronización en segundo plano:', error);
  }
}

// Manejar mensajes desde los clientes
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'MANUAL_SYNC') {
    syncPendingRequests();
  }
});

console.log('Custom service worker loaded');
