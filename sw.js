
// Nombre del caché
const CACHE_NAME = 'la-rioja-cuida-v1';

// This will be replaced by the precache manifest during build
self.__WB_MANIFEST;

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
  console.log('Service Worker: Instalando...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Caché abierto');
        return cache.addAll(INITIAL_CACHED_RESOURCES);
      })
      .catch(error => console.error('Error en la instalación del caché:', error))
  );
});

// Limpieza de cachés antiguos cuando se activa un nuevo SW
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activando...');
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
    }).then(() => {
      console.log('Service Worker ahora está activo');
      // Reclamar el control inmediatamente
      return self.clients.claim();
    })
  );
});

// Escuchar mensaje para activar inmediatamente (cuando el usuario confirma la actualización)
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('Service Worker: Recibida orden para actualizar');
    self.skipWaiting();
  }
});

// Estrategia para recursos estáticos: Cache First
const cacheFirstStrategy = async (request) => {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    return null; // Si falla la red y no está en caché
  }
};

// Estrategia para API: Network First
const networkFirstStrategy = async (request) => {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    return null;
  }
};

// Interceptar solicitudes de red
self.addEventListener('fetch', (event) => {
  // Solo manejar solicitudes GET
  if (event.request.method !== 'GET') return;
  
  const url = new URL(event.request.url);
  
  // Para solicitudes a la API, usar Network First
  if (url.pathname.startsWith('/api')) {
    event.respondWith(
      networkFirstStrategy(event.request)
        .then(response => response || caches.match('/offline.html'))
    );
    return;
  }
  
  // Para recursos estáticos (imágenes, CSS, JS), usar Cache First
  if (
    url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|webp|ico)$/) ||
    url.pathname.startsWith('/assets/') ||
    url.pathname.startsWith('/lovable-uploads/')
  ) {
    event.respondWith(
      cacheFirstStrategy(event.request)
        .then(response => response || fetch(event.request))
    );
    return;
  }
  
  // Para fuentes de Google, usar Cache First con mayor tiempo de vida
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(
      cacheFirstStrategy(event.request)
        .then(response => response || fetch(event.request))
    );
    return;
  }
  
  // Para solicitudes de navegación (HTML), usar Network First y devolver offline.html si falla
  if (event.request.mode === 'navigate') {
    event.respondWith(
      networkFirstStrategy(event.request)
        .then(response => response || caches.match('/offline.html'))
        .catch(() => caches.match('/offline.html'))
    );
    return;
  }
  
  // Para cualquier otra solicitud
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }
        
        return fetch(event.request)
          .then(networkResponse => {
            if (networkResponse && networkResponse.status === 200) {
              const responseClone = networkResponse.clone();
              caches.open(CACHE_NAME).then(cache => {
                cache.put(event.request, responseClone);
              });
            }
            return networkResponse;
          })
          .catch(() => {
            // Para solicitudes de navegación, devolver offline.html
            if (event.request.mode === 'navigate') {
              return caches.match('/offline.html');
            }
            return new Response('Sin conexión', { status: 503, statusText: 'Sin conexión disponible' });
          });
      })
  );
});
