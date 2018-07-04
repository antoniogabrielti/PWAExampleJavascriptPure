const CACHE_NAME = 'my-app-static-files-v1';
const CACHE_DATA_NAME = 'my-app-data-v1';
var urlsToCache = [
  '/',
  '/app.js'
];


//Cacheia minhas paginas (webshell) da minha aplicacao
self.addEventListener('install', (event) => {
  console.log("Service Worker cacheando paginas ...", event);

  return event.waitUntil(
    self.caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
});

//metodo responsavel pela limpeza do meu cache.
self.addEventListener('activate', (event) => {
  console.log('service worker activate', event);
  var cacheWhiteList = [CACHE_NAME,CACHE_DATA_NAME];

  return event.waitUntil(
    self.caches.keys() //lista de caches salvos
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {//itero os caches salvos e deixo apenas os que estão na minha whiteList
            if (cacheWhiteList.indexOf(cacheName) === -1) {
              return self.caches.delete(cacheName);
            }
          })
        )
      })
  );
});

self.addEventListener('fetch',(event)=>{
  console.log("Fetch event service work",event);
  var dataUrl = 'https://api.github.com';

  //busca primeiro no webshell do meu cache caso não encontre busca na rede(cacheFirst)
  if(event.request.url.indexOf(dataUrl) === -1){
    event.respondWith(
      self.caches.match(event.request)
        .then((response) =>{
          return response || self.fetch(event.request)
        })
    )
  }else{
    event.respondWith(
      self.fetch(event.request)
        .then((response) =>{
          return self.caches.open(CACHE_DATA_NAME)
            .then((cache)=>{
              cache.put(event.request.url, response.clone());
              return response;
            })
        }).catch((error)=>{
          return self.caches.match(event.request);
        })
    )
  }
})