
// Nombre del caché
const CACHE_NAME = 'la-rioja-cuida-v1';

// Recursos que queremos cachear para uso offline
const INITIAL_CACHED_RESOURCES = [
  '/',
  '/index.html',
  '/offline.html',
  '/lovable-uploads/a4799124-8538-46ae-9f04-366618a71181.png',
  '/manifest.json'
];

// Instalación del service worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Caché abierto');
        return cache.addAll(INITIAL_CACHED_RESOURCES);
      })
      .catch(error => console.error('Error en la instalación del caché:', error))
  );
  
  // Activar inmediatamente sin esperar a que se cierren las páginas
  // Nota: Esto es opcional, comentar si prefieres comportamiento estándar
  // self.skipWaiting();
});

// Limpieza de cachés antiguos cuando se activa un nuevo SW
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Eliminando caché antiguo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  
  // Reclamar el control inmediatamente
  event.waitUntil(self.clients.claim());
});

// Escuchar mensaje para activar inmediatamente (cuando el usuario confirma la actualización)
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Interceptar solicitudes de red
self.addEventListener('fetch', (event) => {
  // Solo manejar solicitudes GET
  if (event.request.method !== 'GET') return;
  
  // Evitar cachear solicitudes a la API
  const url = new URL(event.request.url);
  if (url.pathname.startsWith('/api')) {
    return;
  }

  event.respondWith(
    // Intentar obtener el recurso de la red primero
    fetch(event.request)
      .then((networkResponse) => {
        // Si la respuesta es válida, guardarla en caché
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // Si falla la red, intentar servir desde caché
        return caches.match(event.request)
          .then((cachedResponse) => {
            // Si está en caché, devolverlo
            if (cachedResponse) {
              return cachedResponse;
            }
            
            // Para solicitudes de navegación (HTML), devolver página offline
            if (event.request.mode === 'navigate') {
              return caches.match('/offline.html');
            }
            
            // Si no está en caché y no es navegación, no podemos servirlo
            return new Response('No hay conexión y el recurso no está en caché', {
              status: 503,
              statusText: 'Service Unavailable'
            });
          });
      })
  );
});
