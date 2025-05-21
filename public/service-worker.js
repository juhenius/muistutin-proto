self.addEventListener('install', (event) => {
  console.log('Muistutin service worker installed.');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Muistutin service worker activated.');
}); 